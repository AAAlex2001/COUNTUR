"""Тесты сценариев корзины без БД."""

import asyncio

import pytest

from app.cart.services.exceptions import (
    CartItemNotFoundError,
    NotEnoughStockError,
    ProductUnavailableError,
)
from app.cart.services.usecases.add_item import AddCartItemUseCase
from app.cart.services.usecases.remove_item import RemoveCartItemUseCase
from app.cart.services.usecases.set_quantity import SetCartItemQuantityUseCase
from app.cart.services.validators import MAX_QUANTITY
from app.catalog.models import Availability, PublicationStatus
from app.catalog.services.exceptions import ProductNotFoundError
from tests.fakes import FakeCartRepository, FakeProductRepository, make_product

USER = 1


def make_repositories(*products) -> tuple[FakeCartRepository, FakeProductRepository]:
    product_repo = FakeProductRepository(list(products))

    return FakeCartRepository(product_repo), product_repo


def test_add_puts_new_item() -> None:
    cart, products = make_repositories(make_product(1))
    usecase = AddCartItemUseCase(cart, products)

    items = asyncio.run(usecase.execute(USER, 1, 2))

    assert len(items) == 1
    assert items[0].product_id == 1
    assert items[0].quantity == 2


def test_add_same_product_sums_quantity() -> None:
    cart, products = make_repositories(make_product(1))
    usecase = AddCartItemUseCase(cart, products)

    asyncio.run(usecase.execute(USER, 1, 2))
    items = asyncio.run(usecase.execute(USER, 1, 3))

    assert len(items) == 1
    assert items[0].quantity == 5


def test_add_keeps_carts_of_users_apart() -> None:
    cart, products = make_repositories(make_product(1))
    usecase = AddCartItemUseCase(cart, products)

    asyncio.run(usecase.execute(USER, 1, 1))
    items = asyncio.run(usecase.execute(2, 1, 4))

    assert [item.quantity for item in items] == [4]


def test_add_rejects_unknown_and_unpublished_product() -> None:
    draft = make_product(2, status=PublicationStatus.DRAFT)
    cart, products = make_repositories(draft)
    usecase = AddCartItemUseCase(cart, products)

    with pytest.raises(ProductNotFoundError):
        asyncio.run(usecase.execute(USER, 1, 1))

    with pytest.raises(ProductNotFoundError):
        asyncio.run(usecase.execute(USER, 2, 1))


def test_add_rejects_product_out_of_stock() -> None:
    cart, products = make_repositories(make_product(1, availability=Availability.EXPECTED))
    usecase = AddCartItemUseCase(cart, products)

    with pytest.raises(ProductUnavailableError):
        asyncio.run(usecase.execute(USER, 1, 1))

    assert cart.items == []


def test_add_counts_what_is_already_in_cart_against_stock() -> None:
    cart, products = make_repositories(make_product(1, stock_quantity=3))
    usecase = AddCartItemUseCase(cart, products)

    asyncio.run(usecase.execute(USER, 1, 2))

    with pytest.raises(NotEnoughStockError):
        asyncio.run(usecase.execute(USER, 1, 2))

    assert cart.items[0].quantity == 2


def test_add_rejects_quantity_over_limit() -> None:
    cart, products = make_repositories(make_product(1))
    usecase = AddCartItemUseCase(cart, products)

    asyncio.run(usecase.execute(USER, 1, MAX_QUANTITY))

    with pytest.raises(NotEnoughStockError):
        asyncio.run(usecase.execute(USER, 1, 1))


def test_set_quantity_replaces_quantity() -> None:
    cart, products = make_repositories(make_product(1, stock_quantity=5))
    cart.put(USER, 1, 1)
    usecase = SetCartItemQuantityUseCase(cart)

    items = asyncio.run(usecase.execute(USER, 1, 5))

    assert items[0].quantity == 5

    with pytest.raises(NotEnoughStockError):
        asyncio.run(usecase.execute(USER, 1, 6))

    assert cart.items[0].quantity == 5


def test_set_quantity_rejects_missing_item() -> None:
    cart, products = make_repositories(make_product(1))
    usecase = SetCartItemQuantityUseCase(cart)

    with pytest.raises(CartItemNotFoundError):
        asyncio.run(usecase.execute(USER, 1, 1))


def test_remove_deletes_only_requested_item() -> None:
    cart, products = make_repositories(make_product(1), make_product(2))
    cart.put(USER, 1, 1)
    cart.put(USER, 2, 3)
    usecase = RemoveCartItemUseCase(cart)

    items = asyncio.run(usecase.execute(USER, 1))

    assert [item.product_id for item in items] == [2]

    with pytest.raises(CartItemNotFoundError):
        asyncio.run(usecase.execute(USER, 1))
