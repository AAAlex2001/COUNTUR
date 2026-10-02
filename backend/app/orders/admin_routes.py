from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.admin.dependencies import require_admin
from app.config import get_settings
from app.orders.dependencies import (
    get_order_by_id,
    get_order_repository,
    get_update_order_status_usecase,
)
from app.orders.models import Order, OrderStatus
from app.orders.schemas import OrderAdminListSchema, OrderAdminSchema, OrderStatusUpdateSchema
from app.orders.services.exceptions import OrderStatusError
from app.orders.services.repo import OrderRepository
from app.orders.services.usecases.update_order_status import UpdateOrderStatusUseCase
from app.orders.services.validators import day_bounds

router = APIRouter(
    prefix="/admin/orders",
    tags=["admin: orders"],
    dependencies=[Depends(require_admin)],
)


@router.get("")
async def list_orders(
    number: int | None = Query(None, ge=1, description="Номер заказа"),
    created_on: date | None = Query(None, description="Дата оформления, например 2026-10-02"),
    order_status: OrderStatus | None = Query(None, alias="status", description="Статус заказа"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    orders: OrderRepository = Depends(get_order_repository),
) -> OrderAdminListSchema:
    """Список заказов, свежие первыми. Поиск по номеру и дате, фильтр по статусу."""

    created_from = None
    created_to = None
    if created_on is not None:
        created_from, created_to = day_bounds(created_on, get_settings().shop_timezone)

    items, total = await orders.list_all(
        number, created_from, created_to, order_status, limit, offset
    )

    return OrderAdminListSchema(
        orders=[OrderAdminSchema.model_validate(item) for item in items],
        total=total,
    )


@router.get("/{order_id}")
async def get_order(
    order: Order = Depends(get_order_by_id),
) -> OrderAdminSchema:
    """Заказ целиком: состав, сумма, контакты, статусы."""

    return OrderAdminSchema.model_validate(order)


@router.patch("/{order_id}")
async def update_order_status(
    payload: OrderStatusUpdateSchema,
    order: Order = Depends(get_order_by_id),
    usecase: UpdateOrderStatusUseCase = Depends(get_update_order_status_usecase),
) -> OrderAdminSchema:
    """Изменить статус заказа и статус оплаты. Отмена возвращает товары на склад."""

    try:
        updated = await usecase.execute(order, payload)
    except OrderStatusError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    return OrderAdminSchema.model_validate(updated)
