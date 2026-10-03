"""Тесты сценариев заказа без БД."""

import asyncio
from datetime import date, datetime, timezone
from decimal import Decimal

import pytest

from app.cart.services.exceptions import NotEnoughStockError, ProductUnavailableError
from app.catalog.models import Availability, PublicationStatus
from app.orders.models import DeliveryMethod, OrderStatus, PaymentStatus
from app.orders.schemas import OrderCreateSchema, OrderStatusUpdateSchema
from app.orders.services.exceptions import EmptyCartError, InvalidPhoneError, OrderStatusError
from app.orders.services.usecases.create_order import CreateOrderUseCase
from app.orders.services.usecases.update_order_status import UpdateOrderStatusUseCase
from app.orders.services.validators import day_bounds, normalize_phone
from tests.fakes import (
    FakeCartRepository,
    FakeOrderRepository,
    FakeProductRepository,
    make_product,
)

USER = 1


def make_payload(phone: str = "+7 (999) 000-00-00") -> OrderCreateSchema:
    return OrderCreateSchema(
        customer_name="Алексей",
        customer_phone=phone,
        customer_email="buyer@example.com",
        delivery_method=DeliveryMethod.COURIER,
        delivery_address="Москва, Тверская, 1",
    )


def make_usecases(*products):
    product_repo = FakeProductRepository(list(products))
    cart = FakeCartRepository(product_repo)
    orders = FakeOrderRepository(cart)

    create = CreateOrderUseCase(orders, cart, product_repo)
    update = UpdateOrderStatusUseCase(orders, product_repo)

    return create, update, cart, orders


def test_create_copies_cart_into_order() -> None:
    cpu = make_product(1, price="42990", stock_quantity=5)
    ram = make_product(2, price="9490")
    create, _, cart, orders = make_usecases(cpu, ram)
    cart.put(USER, 1, 2)
    cart.put(USER, 2, 1)
    cart.put(2, 2, 7)

    order = asyncio.run(create.execute(USER, make_payload()))

    assert order.total == Decimal("95470")
    assert order.status == OrderStatus.NEW
    assert order.payment_status == PaymentStatus.UNPAID
    assert order.customer_phone == "+79990000000"
    assert [(item.product_name, item.price, item.quantity) for item in order.items] == [
        ("Товар 1", Decimal("42990"), 2),
        ("Товар 2", Decimal("9490"), 1),
    ]
    assert orders.items == [order]

    assert [item.user_id for item in cart.items] == [2]


def test_create_writes_off_tracked_stock_only() -> None:
    tracked = make_product(1, stock_quantity=2)
    untracked = make_product(2)
    create, _, cart, _ = make_usecases(tracked, untracked)
    cart.put(USER, 1, 2)
    cart.put(USER, 2, 10)

    asyncio.run(create.execute(USER, make_payload()))

    assert tracked.stock_quantity == 0
    assert tracked.availability == Availability.OUT_OF_STOCK
    assert untracked.stock_quantity is None
    assert untracked.availability == Availability.IN_STOCK


def test_create_rejects_empty_cart() -> None:
    create, _, _, orders = make_usecases(make_product(1))

    with pytest.raises(EmptyCartError):
        asyncio.run(create.execute(USER, make_payload()))

    assert orders.items == []


def test_create_rejects_invalid_phone() -> None:
    create, _, cart, orders = make_usecases(make_product(1))
    cart.put(USER, 1, 1)

    with pytest.raises(InvalidPhoneError):
        asyncio.run(create.execute(USER, make_payload(phone="12345")))

    assert orders.items == []


def test_create_changes_nothing_when_one_item_is_short() -> None:
    plenty = make_product(1, stock_quantity=10)
    short = make_product(2, stock_quantity=1)
    create, _, cart, orders = make_usecases(plenty, short)
    cart.put(USER, 1, 3)
    cart.put(USER, 2, 2)

    with pytest.raises(NotEnoughStockError):
        asyncio.run(create.execute(USER, make_payload()))

    assert plenty.stock_quantity == 10
    assert short.stock_quantity == 1
    assert orders.items == []
    assert len(cart.items) == 2


def test_create_rejects_product_that_became_unavailable() -> None:
    product = make_product(1)
    create, _, cart, _ = make_usecases(product)
    cart.put(USER, 1, 1)
    product.availability = Availability.OUT_OF_STOCK

    with pytest.raises(ProductUnavailableError):
        asyncio.run(create.execute(USER, make_payload()))


def test_create_skips_products_removed_from_publication() -> None:
    kept = make_product(1, price="500")
    hidden = make_product(2, price="900")
    create, _, cart, _ = make_usecases(kept, hidden)
    cart.put(USER, 1, 1)
    cart.put(USER, 2, 1)
    hidden.status = PublicationStatus.UNPUBLISHED

    order = asyncio.run(create.execute(USER, make_payload()))

    assert order.total == Decimal("500")
    assert [item.product_id for item in order.items] == [1]


def test_cancel_returns_stock_and_is_final() -> None:
    product = make_product(1, stock_quantity=2)
    create, update, cart, _ = make_usecases(product)
    cart.put(USER, 1, 2)
    order = asyncio.run(create.execute(USER, make_payload()))
    assert product.availability == Availability.OUT_OF_STOCK

    asyncio.run(update.execute(order, OrderStatusUpdateSchema(status=OrderStatus.CANCELED)))

    assert order.status == OrderStatus.CANCELED
    assert product.stock_quantity == 2
    assert product.availability == Availability.IN_STOCK

    with pytest.raises(OrderStatusError):
        asyncio.run(update.execute(order, OrderStatusUpdateSchema(status=OrderStatus.NEW)))

    asyncio.run(update.execute(order, OrderStatusUpdateSchema(status=OrderStatus.CANCELED)))
    assert product.stock_quantity == 2


def test_update_changes_statuses_independently() -> None:
    product = make_product(1, stock_quantity=5)
    create, update, cart, _ = make_usecases(product)
    cart.put(USER, 1, 1)
    order = asyncio.run(create.execute(USER, make_payload()))

    asyncio.run(update.execute(order, OrderStatusUpdateSchema(payment_status=PaymentStatus.PAID)))

    assert order.status == OrderStatus.NEW
    assert order.payment_status == PaymentStatus.PAID
    assert product.stock_quantity == 4


def test_normalize_phone() -> None:
    assert normalize_phone(" +7 (999) 000-00-00 ") == "+79990000000"
    assert normalize_phone("8 999 000 00 00") == "89990000000"

    with pytest.raises(InvalidPhoneError):
        normalize_phone("999-00")


def test_day_bounds_follow_shop_timezone() -> None:
    start, end = day_bounds(date(2026, 10, 2), "Europe/Moscow")

    assert start == datetime(2026, 10, 1, 21, 0, tzinfo=timezone.utc)
    assert end == datetime(2026, 10, 2, 21, 0, tzinfo=timezone.utc)
