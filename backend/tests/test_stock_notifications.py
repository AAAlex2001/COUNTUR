"""Проверки подписки на поступление и отправки одного уведомления."""

import asyncio
from datetime import UTC, datetime
from unittest.mock import AsyncMock

import pytest

from app.catalog.models import Availability, Product
from app.catalog.services.exceptions import ProductNotFoundError
from app.mail import EmailClient, MailDeliveryError
from app.stock_notifications.models import StockSubscription
from app.stock_notifications.repository import StockNotice, StockSubscriptionRepository
from app.stock_notifications.usecases.send_stock_notification import SendStockNotificationUseCase
from app.stock_notifications.usecases.subscribe import (
    ProductAlreadyAvailableError,
    SubscribeToStockUseCase,
)


@pytest.mark.parametrize("availability", [Availability.EXPECTED, Availability.OUT_OF_STOCK])
def test_subscribe_to_unavailable_product(availability):
    products, subscriptions = AsyncMock(), AsyncMock()
    products.get_published_by_id.return_value = Product(id=10, availability=availability)

    asyncio.run(SubscribeToStockUseCase(products, subscriptions).execute(3, 10))

    products.get_published_by_id.assert_awaited_once_with(10, lock=True)
    subscriptions.add.assert_awaited_once_with(3, 10)


@pytest.mark.parametrize(
    ("product", "error"),
    [
        (None, ProductNotFoundError),
        (Product(availability=Availability.IN_STOCK), ProductAlreadyAvailableError),
    ],
)
def test_reject_unsubscribable_product(product, error):
    products, subscriptions = AsyncMock(), AsyncMock()
    products.get_published_by_id.return_value = product

    with pytest.raises(error):
        asyncio.run(SubscribeToStockUseCase(products, subscriptions).execute(3, 10))
    subscriptions.add.assert_not_called()


@pytest.mark.parametrize("smtp_failed", [False, True])
def test_delivery_consumes_subscription_only_after_success(smtp_failed):
    subscriptions = AsyncMock(spec=StockSubscriptionRepository)
    mail = AsyncMock(spec=EmailClient)
    subscription = StockSubscription(product_id=10, user_id=3)
    subscriptions.next_notice.return_value = StockNotice(
        subscription, "buyer@example.com", "Товар", "tovar"
    )
    usecase = SendStockNotificationUseCase(subscriptions, mail, "https://example.com")

    if smtp_failed:
        mail.send.side_effect = MailDeliveryError()

    assert asyncio.run(usecase.execute())

    mail.send.assert_awaited_once()
    recipient, content = mail.send.await_args.args
    assert recipient == "buyer@example.com"
    assert content.link_url == "https://example.com/product/tovar"

    if smtp_failed:
        subscriptions.mark_notified.assert_not_awaited()
        assert subscription.next_attempt_at > datetime.now(UTC)
    else:
        subscriptions.mark_notified.assert_awaited_once_with(subscription)
