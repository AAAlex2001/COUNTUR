"""Тесты сценария ответа на обращение без БД и почты."""

import asyncio

import pytest

from app.feedback.models import FeedbackMessage, FeedbackStatus
from app.feedback.schemas import FeedbackReplySchema
from app.feedback.services.exceptions import MailDeliveryError
from app.feedback.services.usecases.reply_feedback import ReplyFeedbackUseCase


class FakeRepository:
    """Запоминает, сохранялось ли обращение."""

    def __init__(self) -> None:
        self.saved = None

    async def save(self, message: FeedbackMessage) -> FeedbackMessage:
        self.saved = message

        return message


def make_message() -> FeedbackMessage:
    return FeedbackMessage(
        id=1,
        name="Алексей",
        email="buyer@example.com",
        subject="Где заказ?",
        message="Оформил неделю назад, статус не меняется.",
        status=FeedbackStatus.NEW,
    )


def test_reply_sends_letter_then_marks_answered() -> None:
    sent = []

    async def send_mail(to: str, subject: str, body: str) -> None:
        sent.append((to, subject, body))

    repo = FakeRepository()
    message = make_message()

    asyncio.run(ReplyFeedbackUseCase(repo, send_mail).execute(message, FeedbackReplySchema(text="Уже едет")))

    assert sent == [("buyer@example.com", "Re: Где заказ?", "Уже едет")]
    assert message.status == FeedbackStatus.ANSWERED
    assert message.reply == "Уже едет"
    assert message.answered_at is not None
    assert repo.saved is message


def test_reply_keeps_message_untouched_when_mail_fails() -> None:
    async def send_mail(to: str, subject: str, body: str) -> None:
        raise MailDeliveryError("Почтовый сервер не принял письмо")

    repo = FakeRepository()
    message = make_message()

    with pytest.raises(MailDeliveryError):
        asyncio.run(ReplyFeedbackUseCase(repo, send_mail).execute(message, FeedbackReplySchema(text="Ок")))

    assert message.status == FeedbackStatus.NEW
    assert message.reply is None
    assert repo.saved is None
