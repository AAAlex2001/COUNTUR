from sqlalchemy.orm import Session, sessionmaker
from telebot import TeleBot

from app.handlers import SupportHandlers
from app.services.repo import ReplyRepository
from app.services.usecases.forward_request import ForwardRequestUseCase
from app.services.usecases.reply_to_request import ReplyToRequestUseCase


def get_handlers(bot: TeleBot, owner: int, sessions: sessionmaker[Session]) -> SupportHandlers:
    """Связывает Telegram-обработчики с репозиторием и сценариями поддержки."""

    replies = ReplyRepository(sessions)
    return SupportHandlers(
        bot,
        owner,
        ForwardRequestUseCase(bot, owner, replies),
        ReplyToRequestUseCase(bot, replies),
    )
