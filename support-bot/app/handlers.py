from telebot import TeleBot
from telebot.types import CallbackQuery, Message

from app.keyboards import REPLY_PREFIX
from app.repositories.replies import ReplyRepository
from app.request_dialog import RequestDialog
from app.usecases.reply_to_request import ReplyResult, ReplyToRequestUseCase

REPLY_MESSAGES = {
    ReplyResult.SENT: "Ответ по заявке #{request_id} отправлен пользователю.",
    ReplyResult.CLOSED: "Заявка не найдена или на неё уже ответили.",
    ReplyResult.INVALID: "Введите непустой ответ, который поместится в одно сообщение.",
    ReplyResult.FAILED: "Не удалось отправить ответ пользователю. Повторите отправку.",
    ReplyResult.DELIVERED_BUT_OPEN: "Ответ отправлен, но закрыть заявку #{request_id} не удалось.",
}


def is_reply_button(call: CallbackQuery) -> bool:
    """Распознать кнопку ответа."""

    return bool(call.data and call.data.startswith(REPLY_PREFIX))


class SupportHandlers:
    """Команды и сообщения поддержки."""

    def __init__(
        self,
        bot: TeleBot,
        owner_chat_id: int,
        requests: RequestDialog,
        replies: ReplyRepository,
        send_reply: ReplyToRequestUseCase,
    ) -> None:
        """Подключить диалоги поддержки."""

        self.bot = bot
        self.owner_chat_id = owner_chat_id
        self.requests = requests
        self.replies = replies
        self.send_reply = send_reply
        self.selected_request_id: str | None = None

    def register(self) -> None:
        """Подключить команды Telegram."""

        self.bot.register_message_handler(self.start, commands=["start"], chat_types=["private"])
        self.bot.register_message_handler(self.cancel, commands=["cancel"], chat_types=["private"])
        self.bot.register_message_handler(
            self.receive_text, content_types=["text"], chat_types=["private"]
        )
        self.bot.register_callback_query_handler(self.select_reply, func=is_reply_button)

    def start(self, message: Message) -> None:
        """Начать обращение."""

        chat_id = message.chat.id
        if chat_id == self.owner_chat_id:
            self.selected_request_id = None
        self.requests.start(chat_id)

    def cancel(self, message: Message) -> None:
        """Отменить текущий диалог."""

        if message.chat.id == self.owner_chat_id and self.selected_request_id:
            self.selected_request_id = None
            self.bot.send_message(self.owner_chat_id, "Ответ отменён.")
            return

        self.start(message)

    def select_reply(self, call: CallbackQuery) -> None:
        """Выбрать заявку для ответа."""

        if (
            not call.message
            or call.from_user.id != self.owner_chat_id
            or call.message.chat.id != self.owner_chat_id
        ):
            self.bot.answer_callback_query(call.id, "Эта кнопка доступна только владельцу.")
            return

        self.selected_request_id = None
        request_id = call.data.removeprefix(REPLY_PREFIX)
        if self.replies.get_recipient(request_id) is None:
            self.bot.answer_callback_query(call.id, REPLY_MESSAGES[ReplyResult.CLOSED])
            return

        self.selected_request_id = request_id
        self.bot.answer_callback_query(call.id)
        self.bot.send_message(
            self.owner_chat_id,
            f"Напишите ответ для заявки #{request_id}. Для отмены отправьте /cancel.",
        )

    def receive_text(self, message: Message) -> None:
        """Принять сообщение в диалоге."""

        chat_id = message.chat.id
        text = (message.text or "").strip()
        if (
            chat_id == self.owner_chat_id
            and message.from_user.id == chat_id
            and self.selected_request_id
        ):
            self.answer_request(self.selected_request_id, text)
            return

        self.requests.receive(chat_id, text)

    def answer_request(self, request_id: str, text: str) -> None:
        """Ответить по выбранной заявке."""

        result = self.send_reply.execute(request_id, text)
        if result in (ReplyResult.SENT, ReplyResult.CLOSED, ReplyResult.DELIVERED_BUT_OPEN):
            self.selected_request_id = None

        self.bot.send_message(
            self.owner_chat_id, REPLY_MESSAGES[result].format(request_id=request_id)
        )
