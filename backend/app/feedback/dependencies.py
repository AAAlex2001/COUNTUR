from fastapi import Depends, HTTPException, status

from app.config import Settings, get_settings
from app.database import DatabaseSession
from app.feedback.models import FeedbackMessage
from app.feedback.repository import FeedbackRepository
from app.feedback.usecases.reply_feedback import ReplyFeedbackUseCase
from app.mail import EmailClient


def get_feedback_repository(db: DatabaseSession) -> FeedbackRepository:
    """Подключить обращения."""

    return FeedbackRepository(db)


async def get_message_by_id(
    message_id: int,
    messages: FeedbackRepository = Depends(get_feedback_repository),
) -> FeedbackMessage:
    """Найти обращение администратора."""

    message = await messages.get_by_id(message_id)
    return require_feedback_message(message)


async def get_message_for_reply(
    message_id: int,
    messages: FeedbackRepository = Depends(get_feedback_repository),
) -> FeedbackMessage:
    """Заблокировать обращение для ответа."""

    message = await messages.lock_for_reply(message_id)
    return require_feedback_message(message)


def require_feedback_message(message: FeedbackMessage | None) -> FeedbackMessage:
    """Проверить наличие обращения."""

    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Обращение не найдено",
        )

    return message


def get_reply_usecase(
    messages: FeedbackRepository = Depends(get_feedback_repository),
    settings: Settings = Depends(get_settings),
) -> ReplyFeedbackUseCase:
    """Сценарий ответа на обращение."""

    return ReplyFeedbackUseCase(messages=messages, mail=EmailClient(settings))
