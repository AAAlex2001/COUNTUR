"""Тесты сценария ответа на обращение без БД и почты."""

import asyncio
from unittest.mock import create_autospec

import pytest
from pydantic import ValidationError

from app.feedback.exceptions import FeedbackNotFoundError
from app.feedback.models import FeedbackMessage, FeedbackStatus
from app.feedback.schemas import FeedbackCreateSchema, FeedbackReplySchema
from app.feedback.usecases.reply_feedback import ReplyFeedbackUseCase
from app.mail import EmailClient, MailDeliveryError
from app.mail_content import MailContent


class FakeRepository:
    """Запоминает, сохранялось ли обращение."""

    def __init__(self, message: FeedbackMessage) -> None:
        self.message = message
        self.saved = None

    async def lock_for_reply(self, message_id: int) -> FeedbackMessage | None:
        return self.message if self.message.id == message_id else None

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
    message = make_message()
    repo = FakeRepository(message)
    mail = create_autospec(EmailClient, instance=True)

    asyncio.run(
        ReplyFeedbackUseCase(repo, mail).execute(message.id, FeedbackReplySchema(text="Уже едет"))
    )

    mail.send.assert_awaited_once_with(
        "buyer@example.com",
        MailContent(subject="Re: Где заказ?", heading="Ответ поддержки COUNTUR", body="Уже едет"),
    )
    assert message.status == FeedbackStatus.ANSWERED
    assert message.reply == "Уже едет"
    assert message.answered_at is not None
    assert repo.saved is message


def test_reply_keeps_message_untouched_when_mail_fails() -> None:
    message = make_message()
    repo = FakeRepository(message)
    mail = create_autospec(EmailClient, instance=True)
    mail.send.side_effect = MailDeliveryError("Почтовый сервер не принял письмо")

    with pytest.raises(MailDeliveryError):
        asyncio.run(
            ReplyFeedbackUseCase(repo, mail).execute(message.id, FeedbackReplySchema(text="Ок"))
        )

    assert message.status == FeedbackStatus.NEW
    assert message.reply is None
    assert repo.saved is None


def test_missing_feedback_sends_no_mail() -> None:
    repo = FakeRepository(make_message())
    mail = create_autospec(EmailClient, instance=True)

    with pytest.raises(FeedbackNotFoundError):
        asyncio.run(ReplyFeedbackUseCase(repo, mail).execute(20, FeedbackReplySchema(text="Ок")))

    mail.send.assert_not_awaited()


@pytest.mark.parametrize(
    ("field", "value"), [("name", "  "), ("subject", "  "), ("message", " " * 10)]
)
def test_reject_blank_feedback(field, value) -> None:
    data = {
        "name": "Иван",
        "subject": "Заказ",
        "message": "Где мой заказ?",
        "email": "user@example.com",
        "consent": True,
    }
    data[field] = value

    with pytest.raises(ValidationError):
        FeedbackCreateSchema.model_validate(data)


def test_reject_blank_reply() -> None:
    with pytest.raises(ValidationError):
        FeedbackReplySchema(text="  ")
