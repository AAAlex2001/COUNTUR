"""Тесты сценария ответа на обращение без БД и почты."""

import asyncio
from unittest.mock import create_autospec

import pytest

from app.feedback.models import FeedbackMessage, FeedbackStatus
from app.feedback.schemas import FeedbackReplySchema
from app.feedback.usecases.reply_feedback import ReplyFeedbackUseCase
from app.mail import EmailClient, MailDeliveryError
from app.mail_content import MailContent


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
    repo = FakeRepository()
    message = make_message()
    mail = create_autospec(EmailClient, instance=True)

    asyncio.run(
        ReplyFeedbackUseCase(repo, mail).execute(message, FeedbackReplySchema(text="Уже едет"))
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
    repo = FakeRepository()
    message = make_message()
    mail = create_autospec(EmailClient, instance=True)
    mail.send.side_effect = MailDeliveryError("Почтовый сервер не принял письмо")

    with pytest.raises(MailDeliveryError):
        asyncio.run(
            ReplyFeedbackUseCase(repo, mail).execute(message, FeedbackReplySchema(text="Ок"))
        )

    assert message.status == FeedbackStatus.NEW
    assert message.reply is None
    assert repo.saved is None
