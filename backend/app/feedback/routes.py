from fastapi import APIRouter, Depends, status

from app.feedback.dependencies import get_create_feedback_usecase
from app.feedback.schemas import FeedbackCreatedSchema, FeedbackCreateSchema
from app.feedback.usecases.create_feedback import CreateFeedbackUseCase

router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_feedback(
    payload: FeedbackCreateSchema,
    usecase: CreateFeedbackUseCase = Depends(get_create_feedback_usecase),
) -> FeedbackCreatedSchema:
    """Принять обращение со страницы контактов."""

    message = await usecase.execute(payload)
    return FeedbackCreatedSchema(id=message.id)
