from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.cart.services.exceptions import NotEnoughStockError, ProductUnavailableError
from app.orders.dependencies import get_create_order_usecase, get_order_repository
from app.orders.schemas import OrderCreateSchema, OrderListSchema, OrderSchema
from app.orders.services.exceptions import EmptyCartError, InvalidPhoneError
from app.orders.services.repo import OrderRepository
from app.orders.services.usecases.create_order import CreateOrderUseCase
from app.users.dependencies import require_user
from app.users.models import User

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderCreateSchema,
    user: User = Depends(require_user),
    usecase: CreateOrderUseCase = Depends(get_create_order_usecase),
) -> OrderSchema:
    """Оформить заказ из корзины. После оформления корзина очищается."""

    try:
        order = await usecase.execute(user.id, payload)
    except InvalidPhoneError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error
    except EmptyCartError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Корзина пуста",
        ) from error
    except (ProductUnavailableError, NotEnoughStockError) as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    return OrderSchema.model_validate(order)


@router.get("")
async def list_orders(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user: User = Depends(require_user),
    orders: OrderRepository = Depends(get_order_repository),
) -> OrderListSchema:
    """Заказы текущего покупателя, свежие первыми."""

    items, total = await orders.list_for_user(user.id, limit, offset)

    return OrderListSchema(orders=[OrderSchema.model_validate(item) for item in items], total=total)


@router.get("/{order_id}")
async def get_order(
    order_id: int,
    user: User = Depends(require_user),
    orders: OrderRepository = Depends(get_order_repository),
) -> OrderSchema:
    """Заказ текущего покупателя. Чужой заказ выглядит как несуществующий."""

    order = await orders.get_for_user(order_id, user.id)
    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден",
        )

    return OrderSchema.model_validate(order)
