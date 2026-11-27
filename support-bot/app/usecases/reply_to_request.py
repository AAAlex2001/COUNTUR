import logging
from enum import Enum, auto

from requests import RequestException
from sqlalchemy.exc import SQLAlchemyError
from telebot import TeleBot
from telebot.apihelper import ApiException

from app.messages import message_fits
from app.repositories.replies import ReplyRepository

logger = logging.getLogger(__name__)


class ReplyResult(Enum):
    """Результат ответа покупателю."""

    SENT = auto()
    CLOSED = auto()
    INVALID = auto()
    FAILED = auto()
    DELIVERED_BUT_OPEN = auto()


class ReplyToRequestUseCase:
    """Ответ покупателю."""

    def __init__(self, bot: TeleBot, replies: ReplyRepository) -> None:
        """Подключить адресатов и Telegram."""

        self.bot = bot
        self.replies = replies

    def execute(self, request_id: str, text: str) -> ReplyResult:
        """Отправить ответ покупателю."""

        recipient = self.replies.get_recipient(request_id)
        if recipient is None:
            return ReplyResult.CLOSED

        message = f"Ответ поддержки по заявке #{request_id}:\n\n{text}"
        if not text or not message_fits(message):
            return ReplyResult.INVALID

        try:
            self.bot.send_message(recipient, message)
        except (RequestException, ApiException):
            logger.warning("Не удалось отправить ответ по заявке %s", request_id)
            return ReplyResult.FAILED

        try:
            self.replies.close(request_id)
        except SQLAlchemyError:
            logger.exception("Ответ доставлен, но не удалось закрыть заявку %s", request_id)
            return ReplyResult.DELIVERED_BUT_OPEN

        return ReplyResult.SENT
