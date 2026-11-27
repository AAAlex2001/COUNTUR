import logging
from uuid import uuid4

from requests import RequestException
from sqlalchemy.exc import SQLAlchemyError
from telebot import TeleBot
from telebot.apihelper import ApiException

from app.keyboards import reply_button
from app.repositories.replies import ReplyRepository

logger = logging.getLogger(__name__)


class ForwardRequestUseCase:
    """Передача обращения владельцу."""

    def __init__(self, bot: TeleBot, owner_chat_id: int, replies: ReplyRepository) -> None:
        """Подключить отправку обращений."""

        self.bot = bot
        self.owner_chat_id = owner_chat_id
        self.replies = replies

    def execute(self, chat_id: int, text: str) -> bool:
        """Переслать обращение владельцу."""

        request_id = uuid4().hex
        try:
            self.replies.add(request_id, chat_id)
            self.bot.send_message(self.owner_chat_id, text, reply_markup=reply_button(request_id))
        except SQLAlchemyError:
            logger.exception("Не удалось сохранить адресата заявки")
            return False
        except (RequestException, ApiException):
            logger.warning("Не удалось передать заявку %s владельцу", request_id)
            self.close_undelivered(request_id)
            return False

        return True

    def close_undelivered(self, request_id: str) -> None:
        """Закрыть недоставленное обращение."""

        try:
            self.replies.close(request_id)
        except SQLAlchemyError:
            logger.exception("Не удалось закрыть недоставленную заявку %s", request_id)
