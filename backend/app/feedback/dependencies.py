"""Обращения: репозиторий, сценарий ответа и загрузка обращения по номеру из пути."""

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.feedback.models import FeedbackMessage
from app.feedback.services.repo import FeedbackRepository
from app.feedback.services.usecases.reply_feedback import ReplyFeedbackUseCase
from app.mail import send_mail


def get_feedback_repository(
    session: AsyncSession = Depends(get_session),
) -> FeedbackRepository:
    """Репозиторий обращений с сессией текущего запроса."""

    return FeedbackRepository(session)


async def get_message_by_id(
    message_id: int,
    messages: FeedbackRepository = Depends(get_feedback_repository),
) -> FeedbackMessage:
    """Обращение по номеру из пути для админки. Отсутствующее — 404."""

    message = await messages.get_by_id(message_id)
    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Обращение не найдено",
        )

    return message


def get_reply_usecase(
    messages: FeedbackRepository = Depends(get_feedback_repository),
) -> ReplyFeedbackUseCase:
    """Сценарий ответа на обращение."""

    return ReplyFeedbackUseCase(messages, send_mail)
