from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.admin.dependencies import require_admin
from app.feedback.dependencies import (
    get_feedback_repository,
    get_message_by_id,
    get_reply_usecase,
)
from app.feedback.models import FeedbackMessage, FeedbackStatus
from app.feedback.schemas import FeedbackListSchema, FeedbackReplySchema, FeedbackSchema
from app.feedback.services.exceptions import MailDeliveryError, MailNotConfiguredError
from app.feedback.services.repo import FeedbackRepository
from app.feedback.services.usecases.reply_feedback import ReplyFeedbackUseCase

router = APIRouter(
    prefix="/admin/feedback",
    tags=["admin: feedback"],
    dependencies=[Depends(require_admin)],
)


@router.get("")
async def list_feedback(
    message_status: FeedbackStatus | None = Query(None, alias="status", description="Статус"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    messages: FeedbackRepository = Depends(get_feedback_repository),
) -> FeedbackListSchema:
    """Обращения, свежие первыми. Фильтр по статусу."""

    items, total = await messages.list_all(message_status, limit, offset)

    return FeedbackListSchema(
        messages=[FeedbackSchema.model_validate(item) for item in items],
        total=total,
    )


@router.get("/{message_id}")
async def get_feedback(message: FeedbackMessage = Depends(get_message_by_id)) -> FeedbackSchema:
    """Обращение целиком вместе с ответом."""

    return FeedbackSchema.model_validate(message)


@router.post("/{message_id}/reply")
async def reply_feedback(
    payload: FeedbackReplySchema,
    message: FeedbackMessage = Depends(get_message_by_id),
    usecase: ReplyFeedbackUseCase = Depends(get_reply_usecase),
) -> FeedbackSchema:
    """Ответить на обращение письмом на email отправителя."""

    try:
        updated = await usecase.execute(message, payload)
    except MailNotConfiguredError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Отправка писем не настроена: укажите SMTP в настройках сервера",
        ) from error
    except MailDeliveryError as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(error),
        ) from error

    return FeedbackSchema.model_validate(updated)
