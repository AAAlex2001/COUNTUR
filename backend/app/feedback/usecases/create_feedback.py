from app.feedback.models import FeedbackMessage
from app.feedback.repository import FeedbackRepository
from app.feedback.schemas import FeedbackCreateSchema


class CreateFeedbackUseCase:
    """Приём обращения покупателя."""

    def __init__(self, messages: FeedbackRepository) -> None:
        """Подключить обращения."""

        self.messages = messages

    async def execute(self, payload: FeedbackCreateSchema) -> FeedbackMessage:
        """Создать обращение покупателя."""

        message = FeedbackMessage(
            name=payload.name,
            email=payload.email.lower(),
            subject=payload.subject,
            message=payload.message,
        )
        return await self.messages.add(message)
