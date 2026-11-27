import asyncio
from datetime import UTC, datetime, timedelta
from decimal import Decimal
from unittest.mock import AsyncMock

import pytest

from app.config import get_settings
from app.contacts.models import ContactsSettings
from app.contacts.repository import ContactsSettingsRepository
from app.mail import EmailClient, MailDeliveryError, MailNotConfiguredError
from app.orders.models import DeliveryMethod, Order, OrderMail, OrderStatus
from app.orders.repositories.mail_queue import OrderMailQueue
from app.orders.usecases.send_order_mail import SendOrderMailUseCase
from app.users.models import User


@pytest.fixture
def sender() -> SendOrderMailUseCase:
    contacts = AsyncMock(spec=ContactsSettingsRepository)
    contacts.get.return_value = ContactsSettings(phone="+7 123 456-78-90")
    return SendOrderMailUseCase(
        queue=AsyncMock(spec=OrderMailQueue),
        contacts=contacts,
        settings=get_settings(),
        mail=AsyncMock(spec=EmailClient),
    )


@pytest.fixture
def order(buyer: User) -> Order:
    return Order(
        id=42,
        buyer=buyer,
        customer_name="Анна",
        customer_email="order@example.test",
        total=Decimal("1500"),
        delivery_method=DeliveryMethod.PICKUP_POINT,
        created_at=datetime.now(UTC),
        tracking_number="12345",
        status=OrderStatus.SHIPPED,
    )


@pytest.fixture
def buyer() -> User:
    return User(email="buyer@example.test", notify_orders=True)


def test_empty_queue(sender):
    sender.queue.next_pending.return_value = None

    assert asyncio.run(sender.execute()) is False
    sender.mail.send.assert_not_awaited()


def test_confirm_order_at_checkout_email(sender, order):
    job = OrderMail(order=order, order_id=order.id, kind="confirmation")
    sender.queue.next_pending.return_value = job

    assert asyncio.run(sender.execute()) is True

    recipient, content = sender.mail.send.await_args.args
    assert recipient == order.customer_email
    assert "+7 123 456-78-90" in content.note
    assert job.sent_at is not None


def test_send_tracking_number_to_account_email(sender, order, buyer):
    order.customer_email = None
    job = OrderMail(
        order=order, order_id=order.id, kind="shipment", reference=order.tracking_number
    )
    sender.queue.next_pending.return_value = job

    assert asyncio.run(sender.execute()) is True

    recipient, content = sender.mail.send.await_args.args
    assert recipient == buyer.email
    assert ("Трек-номер", order.tracking_number) in content.details
    sender.contacts.get.assert_not_awaited()
    assert job.sent_at is not None


@pytest.mark.parametrize(
    ("kind", "subscribed", "status", "reference"),
    [
        ("confirmation", False, OrderStatus.NEW, ""),
        ("shipment", True, OrderStatus.CANCELED, "12345"),
        ("shipment", True, OrderStatus.NEW, "12345"),
        ("shipment", True, OrderStatus.SHIPPED, "old-track"),
    ],
)
def test_discard_obsolete_mail(sender, order, buyer, kind, subscribed, status, reference):
    buyer.notify_orders = subscribed
    order.status = status
    job = OrderMail(order=order, order_id=order.id, kind=kind, reference=reference)
    sender.queue.next_pending.return_value = job

    assert asyncio.run(sender.execute()) is True

    sender.queue.discard.assert_awaited_once_with(job)
    sender.mail.send.assert_not_awaited()


@pytest.mark.parametrize("error", [MailDeliveryError, MailNotConfiguredError])
def test_retry_failed_delivery_in_five_minutes(sender, order, error):
    job = OrderMail(order=order, order_id=order.id, kind="confirmation")
    sender.queue.next_pending.return_value = job
    sender.mail.send.side_effect = error
    before = datetime.now(UTC)

    assert asyncio.run(sender.execute()) is True

    assert (
        before + timedelta(minutes=5)
        <= job.next_attempt_at
        <= datetime.now(UTC) + timedelta(minutes=5)
    )
    assert job.sent_at is None
    sender.queue.discard.assert_not_awaited()
