"""Корзина: репозиторий и фабрики сценариев."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.cart.services.repo import CartRepository
from app.cart.services.usecases.add_item import AddCartItemUseCase
from app.cart.services.usecases.remove_item import RemoveCartItemUseCase
from app.cart.services.usecases.set_quantity import SetCartItemQuantityUseCase
from app.catalog.dependencies import get_product_repository
from app.catalog.services.repo import ProductRepository
from app.database import get_session


def get_cart_repository(
    session: AsyncSession = Depends(get_session),
) -> CartRepository:
    """Репозиторий корзины с сессией текущего запроса."""

    return CartRepository(session)


def get_add_item_usecase(
    cart: CartRepository = Depends(get_cart_repository),
    products: ProductRepository = Depends(get_product_repository),
) -> AddCartItemUseCase:
    """Сценарий добавления товара в корзину."""

    return AddCartItemUseCase(cart, products)


def get_set_quantity_usecase(
    cart: CartRepository = Depends(get_cart_repository),
) -> SetCartItemQuantityUseCase:
    """Сценарий изменения количества."""

    return SetCartItemQuantityUseCase(cart)


def get_remove_item_usecase(
    cart: CartRepository = Depends(get_cart_repository),
) -> RemoveCartItemUseCase:
    """Сценарий удаления товара из корзины."""

    return RemoveCartItemUseCase(cart)
