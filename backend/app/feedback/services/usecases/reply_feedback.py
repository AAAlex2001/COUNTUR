"""Сценарий ответа на обращение: письмо отправителю и отметка в базе."""

from collections.abc import Awaitable, Callable
from datetime import UTC, datetime

from app.feedback.models import FeedbackMessage, FeedbackStatus
from app.feedback.schemas import FeedbackReplySchema
from app.feedback.services.repo import FeedbackRepository

SendMail = Callable[[str, str, str], Awaitable[None]]


class ReplyFeedbackUseCase:
    """Ответить на обращение. Сначала уходит письмо, потом сохраняется ответ."""

    def __init__(self, messages: FeedbackRepository, send_mail: SendMail) -> None:
        self.messages = messages
        self.send_mail = send_mail

    async def execute(self, message: FeedbackMessage, payload: FeedbackReplySchema) -> FeedbackMessage:
        """Вернуть обращение с ответом. Бросает ошибки почты, тогда в базе ничего не меняется."""

        await self.send_mail(message.email, f"Re: {message.subject}", payload.text)

        message.reply = payload.text
        message.status = FeedbackStatus.ANSWERED
        message.answered_at = datetime.now(UTC)

        return await self.messages.save(message)
