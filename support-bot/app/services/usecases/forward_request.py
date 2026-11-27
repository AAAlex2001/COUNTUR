import logging
from uuid import uuid4

from sqlalchemy.exc import SQLAlchemyError
from telebot import TeleBot

from app.keyboards import reply_button
from app.services.repo import ReplyRepository
from app.services.request_form import RequestForm

logger = logging.getLogger(__name__)


class ForwardRequestUseCase:
    """Передаёт заявку владельцу вместе с кнопкой для ответа."""

    def __init__(self, bot: TeleBot, owner: int, replies: ReplyRepository) -> None:
        self.bot = bot
        self.owner = owner
        self.replies = replies

    def execute(self, chat_id: int, form: RequestForm) -> bool:
        """Сохраняет адресата, отправляет заявку и возвращает результат доставки."""

        request_id = uuid4().hex
        try:
            self.replies.add(request_id, chat_id)
        except SQLAlchemyError:
            logger.exception("Не удалось сохранить адресата заявки")
            return False

        try:
            self.bot.send_message(self.owner, form.summary(), reply_markup=reply_button(request_id))
        except Exception:
            logger.warning("Could not deliver support request %s", request_id)
            try:
                self.replies.close(request_id)
            except SQLAlchemyError:
                logger.exception("Не удалось закрыть недоставленную заявку %s", request_id)
            return False
        return True
