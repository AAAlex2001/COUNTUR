from telebot import TeleBot

from app.handlers import SupportHandlers
from app.repositories.replies import ReplyRepository
from app.request_dialog import RequestDialog
from app.usecases.forward_request import ForwardRequestUseCase
from app.usecases.reply_to_request import ReplyToRequestUseCase


def build_handlers(bot: TeleBot, owner_chat_id: int, replies: ReplyRepository) -> SupportHandlers:
    """Собрать обработчики поддержки."""

    forward = ForwardRequestUseCase(bot=bot, owner_chat_id=owner_chat_id, replies=replies)
    return SupportHandlers(
        bot=bot,
        owner_chat_id=owner_chat_id,
        requests=RequestDialog(bot=bot, forward=forward),
        replies=replies,
        send_reply=ReplyToRequestUseCase(bot=bot, replies=replies),
    )
