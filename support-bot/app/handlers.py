from telebot import TeleBot
from telebot.types import CallbackQuery, Message, ReplyKeyboardRemove

from app.keyboards import REPLY_PREFIX, TOPICS, reply_keyboard
from app.services.request_form import (
    INSTRUCTIONS,
    RequestForm,
    Step,
    answer_matches,
)
from app.services.usecases.forward_request import ForwardRequestUseCase
from app.services.usecases.reply_to_request import ReplyToRequestUseCase


class SupportHandlers:
    """Ведёт диалоги покупателей и принимает ответы владельца в личном чате."""

    def __init__(
        self, bot: TeleBot, owner: int, forward: ForwardRequestUseCase, reply: ReplyToRequestUseCase
    ) -> None:
        self.bot = bot
        self.owner = owner
        self.forward = forward
        self.reply = reply
        self.forms: dict[int, RequestForm] = {}

    def register(self) -> None:
        """Подключает команды, сообщения и кнопку ответа к Telegram."""

        self.bot.register_message_handler(self.start, commands=["start"], chat_types=["private"])
        self.bot.register_message_handler(self.cancel, commands=["cancel"], chat_types=["private"])
        self.bot.register_message_handler(self.text, content_types=["text"], chat_types=["private"])
        self.bot.register_callback_query_handler(
            self.select_reply, func=lambda call: bool(call.data and call.data.startswith(REPLY_PREFIX))
        )

    def start(self, message: Message) -> None:
        """Сбрасывает текущий диалог и предлагает выбрать тему."""

        chat_id = message.chat.id
        self.forms.pop(chat_id, None)
        if chat_id == self.owner:
            self.reply.selected_request_id = None
        self.bot.send_message(
            chat_id, "Здравствуйте! Выберите тему вопроса:", reply_markup=reply_keyboard(TOPICS)
        )

    def cancel(self, message: Message) -> None:
        """Отменяет выбранный ответ владельца или анкету покупателя."""

        if message.chat.id == self.owner and self.reply.selected_request_id:
            self.reply.selected_request_id = None
            self.bot.send_message(message.chat.id, "Ответ отменён.")
            return
        self.start(message)

    def select_reply(self, call: CallbackQuery) -> None:
        """Проверяет владельца и привязывает его следующее сообщение к заявке."""

        owner = self.owner
        if not call.message or call.from_user.id != owner or call.message.chat.id != owner:
            self.bot.answer_callback_query(call.id, "Эта кнопка доступна только владельцу.")
            return

        request_id = call.data.removeprefix(REPLY_PREFIX)
        if not self.reply.select(request_id):
            self.bot.answer_callback_query(call.id, "Заявка не найдена или на неё уже ответили.")
            return

        self.bot.answer_callback_query(call.id)
        self.bot.send_message(
            owner, f"Напишите ответ для заявки #{request_id}. Для отмены отправьте /cancel."
        )

    def text(self, message: Message) -> None:
        """Передаёт текст в активную форму или в выбранный владельцем ответ."""

        chat_id = message.chat.id
        text = (message.text or "").strip()
        if chat_id == self.owner and message.from_user.id == chat_id and self.reply.selected_request_id:
            self.bot.send_message(chat_id, self.reply.execute(text))
            return

        form = self.forms.get(chat_id)
        if form is None:
            self.choose_topic(chat_id, text)
        else:
            self.advance(chat_id, form, text)

    def choose_topic(self, chat_id: int, text: str) -> None:
        """Открывает анкету по одной из тем поддержки."""

        if text not in TOPICS:
            self.bot.send_message(
                chat_id, "Сначала выберите тему вопроса:", reply_markup=reply_keyboard(TOPICS)
            )
            return
        self.forms[chat_id] = RequestForm(topic=text)
        self.bot.send_message(chat_id, INSTRUCTIONS, reply_markup=ReplyKeyboardRemove())

    def advance(self, chat_id: int, form: RequestForm, text: str) -> None:
        """Обрабатывает один шаг заполнения или повторной отправки заявки."""

        if form.step == Step.RETRY:
            if answer_matches(text, "Да"):
                form.retries += 1
                self.submit(chat_id, form)
            else:
                self.bot.send_message(
                    chat_id,
                    "Для повторной отправки нажмите «Да».",
                    reply_markup=reply_keyboard(["Да"]),
                )
            return

        if form.step == Step.ADDITION and answer_matches(text, "Нет"):
            self.submit(chat_id, form)
            return

        if form.step == Step.QUESTION:
            prompt = form.fill_question(text)
        elif form.step == Step.ADDITION:
            prompt = form.add_note(text)
        else:
            prompt = form.fill_contact(text)

        if prompt:
            keyboard = reply_keyboard(["Нет"]) if form.step == Step.ADDITION else None
            self.bot.send_message(chat_id, prompt, reply_markup=keyboard)

    def submit(self, chat_id: int, form: RequestForm) -> None:
        """Завершает доставленную заявку или предлагает до трёх повторов."""

        if self.forward.execute(chat_id, form):
            result = "Спасибо! Ваша заявка отправлена в службу поддержки."
        elif form.retries >= 3:
            result = "Не удалось отправить заявку после трёх повторных попыток. Заполните её позже."
        else:
            form.step = Step.RETRY
            self.bot.send_message(
                chat_id,
                "Не удалось отправить заявку. Нажмите «Да» для повтора.",
                reply_markup=reply_keyboard(["Да"]),
            )
            return

        del self.forms[chat_id]
        self.bot.send_message(chat_id, result, reply_markup=reply_keyboard(TOPICS))
