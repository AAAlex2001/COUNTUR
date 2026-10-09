from fastapi import APIRouter, Depends, status

from app.feedback.dependencies import get_feedback_repository
from app.feedback.models import FeedbackMessage
from app.feedback.schemas import FeedbackCreatedSchema, FeedbackCreateSchema
from app.feedback.services.repo import FeedbackRepository

router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_feedback(
    payload: FeedbackCreateSchema,
    messages: FeedbackRepository = Depends(get_feedback_repository),
) -> FeedbackCreatedSchema:
    """Принять обращение со страницы контактов."""

    message = await messages.add(
        FeedbackMessage(
            name=payload.name.strip(),
            email=payload.email.strip().lower(),
            subject=payload.subject.strip(),
            message=payload.message.strip(),
        )
    )

    return FeedbackCreatedSchema(id=message.id)
