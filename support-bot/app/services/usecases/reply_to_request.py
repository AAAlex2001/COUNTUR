import logging

from telebot import TeleBot

from app.services.repo import ReplyRepository
from app.services.request_form import message_fits

logger = logging.getLogger(__name__)


class ReplyToRequestUseCase:
    """Выбирает заявку и передаёт ответ владельца покупателю."""

    def __init__(self, bot: TeleBot, replies: ReplyRepository) -> None:
        self.bot = bot
        self.replies = replies
        self.selected_request_id: str | None = None

    def select(self, request_id: str) -> bool:
        """Выбирает открытое обращение для следующего сообщения владельца."""

        self.selected_request_id = None
        if self.replies.recipient(request_id) is None:
            return False
        self.selected_request_id = request_id
        return True

    def execute(self, text: str) -> str:
        """Доставляет ответ и возвращает владельцу результат отправки."""

        request_id = self.selected_request_id
        if request_id is None:
            return "Выберите заявку для ответа."
        recipient = self.replies.recipient(request_id)
        if recipient is None:
            self.selected_request_id = None
            return "Заявка не найдена или на неё уже ответили."

        message = f"Ответ поддержки по заявке #{request_id}:\n\n{text}"
        if not text or not message_fits(message):
            return "Введите непустой ответ, который поместится в одно сообщение."

        try:
            self.bot.send_message(recipient, message)
        except Exception:
            logger.warning("Could not deliver support reply for %s", request_id)
            return "Не удалось отправить ответ пользователю. Повторите отправку."

        self.selected_request_id = None
        self.replies.close(request_id)
        return f"Ответ по заявке #{request_id} отправлен пользователю."
