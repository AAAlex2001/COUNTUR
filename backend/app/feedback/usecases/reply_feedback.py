from datetime import UTC, datetime

from app.feedback.models import FeedbackMessage, FeedbackStatus
from app.feedback.repository import FeedbackRepository
from app.feedback.schemas import FeedbackReplySchema
from app.mail import EmailClient
from app.mail_content import MailContent


class ReplyFeedbackUseCase:
    """Ответ на обращение."""

    def __init__(self, messages: FeedbackRepository, mail: EmailClient) -> None:
        """Подключить обращения и почту."""

        self.messages = messages
        self.mail = mail

    async def execute(
        self, message: FeedbackMessage, payload: FeedbackReplySchema
    ) -> FeedbackMessage:
        """Ответить покупателю."""

        letter = MailContent(
            subject=f"Re: {message.subject}",
            heading="Ответ поддержки COUNTUR",
            body=payload.text,
        )
        await self.mail.send(message.email, letter)

        message.reply = payload.text
        message.status = FeedbackStatus.ANSWERED
        message.answered_at = datetime.now(UTC)

        return await self.messages.save(message)
