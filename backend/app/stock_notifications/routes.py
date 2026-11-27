from fastapi import APIRouter, Depends, HTTPException

from app.catalog.exceptions import ProductNotFoundError
from app.stock_notifications.dependencies import (
    get_list_subscriptions_usecase,
    get_subscribe_usecase,
    get_unsubscribe_usecase,
)
from app.stock_notifications.usecases.list_subscriptions import ListStockSubscriptionsUseCase
from app.stock_notifications.usecases.subscribe import (
    ProductAlreadyAvailableError,
    SubscribeToStockUseCase,
)
from app.stock_notifications.usecases.unsubscribe import UnsubscribeFromStockUseCase
from app.users.dependencies import require_user
from app.users.models import User

router = APIRouter(prefix="/stock-subscriptions", tags=["stock-subscriptions"])


@router.get("")
async def list_subscriptions(
    user: User = Depends(require_user),
    usecase: ListStockSubscriptionsUseCase = Depends(get_list_subscriptions_usecase),
) -> list[int]:
    """Возвращает активные колокольчики вошедшего покупателя."""

    return await usecase.execute(user.id)


@router.put("/{product_id}", status_code=204)
async def subscribe(
    product_id: int,
    user: User = Depends(require_user),
    usecase: SubscribeToStockUseCase = Depends(get_subscribe_usecase),
) -> None:
    """Включает разовое уведомление для покупателя."""

    try:
        await usecase.execute(user.id, product_id)
    except ProductNotFoundError as error:
        raise HTTPException(404, "Товар не найден") from error
    except ProductAlreadyAvailableError as error:
        raise HTTPException(409, "Товар уже в наличии") from error


@router.delete("/{product_id}", status_code=204)
async def unsubscribe(
    product_id: int,
    user: User = Depends(require_user),
    usecase: UnsubscribeFromStockUseCase = Depends(get_unsubscribe_usecase),
) -> None:
    """Отменяет уведомление для текущего аккаунта."""

    await usecase.execute(user.id, product_id)
