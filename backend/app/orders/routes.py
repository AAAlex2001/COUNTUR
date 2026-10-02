from fastapi import APIRouter, Depends, HTTPException, status

from app.cart.services.exceptions import NotEnoughStockError, ProductUnavailableError
from app.orders.dependencies import get_create_order_usecase, get_order_repository
from app.orders.schemas import OrderCreateSchema, OrderSchema
from app.orders.services.exceptions import EmptyCartError, InvalidPhoneError
from app.orders.services.repo import OrderRepository
from app.orders.services.usecases.create_order import CreateOrderUseCase
from app.visitor import get_visitor_id

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderCreateSchema,
    visitor_id: str = Depends(get_visitor_id),
    usecase: CreateOrderUseCase = Depends(get_create_order_usecase),
) -> OrderSchema:
    """Оформить заказ из корзины. После оформления корзина очищается."""

    try:
        order = await usecase.execute(visitor_id, payload)
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


@router.get("/{order_id}")
async def get_order(
    order_id: int,
    visitor_id: str = Depends(get_visitor_id),
    orders: OrderRepository = Depends(get_order_repository),
) -> OrderSchema:
    """Заказ текущего посетителя. Чужой заказ выглядит как несуществующий."""

    order = await orders.get_for_visitor(order_id, visitor_id)
    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден",
        )

    return OrderSchema.model_validate(order)
