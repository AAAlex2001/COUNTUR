from fastapi import Depends, HTTPException, status

from app.config import Settings, get_settings
from app.database import DatabaseSession
from app.feedback.models import FeedbackMessage
from app.feedback.repository import FeedbackRepository
from app.feedback.usecases.create_feedback import CreateFeedbackUseCase
from app.feedback.usecases.reply_feedback import ReplyFeedbackUseCase
from app.mail import EmailClient


def get_feedback_repository(db: DatabaseSession) -> FeedbackRepository:
    """Подключить обращения."""

    return FeedbackRepository(db)


def get_create_feedback_usecase(
    messages: FeedbackRepository = Depends(get_feedback_repository),
) -> CreateFeedbackUseCase:
    """Подготовить приём обращения."""

    return CreateFeedbackUseCase(messages)


async def get_message_by_id(
    message_id: int,
    messages: FeedbackRepository = Depends(get_feedback_repository),
) -> FeedbackMessage:
    """Найти обращение администратора."""

    message = await messages.get_by_id(message_id)
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
