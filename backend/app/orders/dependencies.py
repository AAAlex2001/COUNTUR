"""Заказы: репозиторий, фабрики сценариев и загрузка заказа по номеру из пути."""

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.cart.dependencies import get_cart_repository
from app.cart.services.repo import CartRepository
from app.catalog.dependencies import get_product_repository
from app.catalog.services.repo import ProductRepository
from app.database import get_session
from app.orders.models import Order
from app.orders.services.repo import OrderRepository
from app.orders.services.usecases.create_order import CreateOrderUseCase
from app.orders.services.usecases.update_order_status import UpdateOrderStatusUseCase


def get_order_repository(
    session: AsyncSession = Depends(get_session),
) -> OrderRepository:
    """Репозиторий заказов с сессией текущего запроса."""

    return OrderRepository(session)


async def get_order_by_id(
    order_id: int,
    orders: OrderRepository = Depends(get_order_repository),
) -> Order:
    """Заказ по номеру из пути для админки. Отсутствующий — 404."""

    order = await orders.get_by_id(order_id)
    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден",
        )

    return order


def get_create_order_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    cart: CartRepository = Depends(get_cart_repository),
    products: ProductRepository = Depends(get_product_repository),
) -> CreateOrderUseCase:
    """Сценарий оформления заказа."""

    return CreateOrderUseCase(orders, cart, products)


def get_update_order_status_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    products: ProductRepository = Depends(get_product_repository),
) -> UpdateOrderStatusUseCase:
    """Сценарий изменения статусов заказа."""

    return UpdateOrderStatusUseCase(orders, products)
