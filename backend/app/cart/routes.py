from fastapi import APIRouter, Depends, HTTPException, status

from app.cart.dependencies import (
    get_add_item_usecase,
    get_cart_repository,
    get_remove_item_usecase,
    get_set_quantity_usecase,
)
from app.cart.schemas import CartItemAddSchema, CartItemUpdateSchema, CartSchema, build_cart_schema
from app.cart.services.exceptions import (
    CartItemNotFoundError,
    NotEnoughStockError,
    ProductUnavailableError,
)
from app.cart.services.repo import CartRepository
from app.cart.services.usecases.add_item import AddCartItemUseCase
from app.cart.services.usecases.remove_item import RemoveCartItemUseCase
from app.cart.services.usecases.set_quantity import SetCartItemQuantityUseCase
from app.catalog.services.exceptions import ProductNotFoundError
from app.visitor import get_visitor_id

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("")
async def get_cart(
    visitor_id: str = Depends(get_visitor_id),
    cart: CartRepository = Depends(get_cart_repository),
) -> CartSchema:
    """Корзина посетителя: состав и итоговая стоимость."""

    items = await cart.list_items(visitor_id)

    return build_cart_schema(items)


@router.post("/items")
async def add_item(
    payload: CartItemAddSchema,
    visitor_id: str = Depends(get_visitor_id),
    usecase: AddCartItemUseCase = Depends(get_add_item_usecase),
) -> CartSchema:
    """Добавить товар в корзину. Повторное добавление увеличивает количество."""

    try:
        items = await usecase.execute(visitor_id, payload.product_id, payload.quantity)
    except ProductNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден",
        ) from error
    except (ProductUnavailableError, NotEnoughStockError) as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    return build_cart_schema(items)


@router.patch("/items/{product_id}")
async def set_item_quantity(
    product_id: int,
    payload: CartItemUpdateSchema,
    visitor_id: str = Depends(get_visitor_id),
    usecase: SetCartItemQuantityUseCase = Depends(get_set_quantity_usecase),
) -> CartSchema:
    """Изменить количество товара в корзине."""

    try:
        items = await usecase.execute(visitor_id, product_id, payload.quantity)
    except CartItemNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товара нет в корзине",
        ) from error
    except (ProductUnavailableError, NotEnoughStockError) as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    return build_cart_schema(items)


@router.delete("/items/{product_id}")
async def remove_item(
    product_id: int,
    visitor_id: str = Depends(get_visitor_id),
    usecase: RemoveCartItemUseCase = Depends(get_remove_item_usecase),
) -> CartSchema:
    """Удалить товар из корзины."""

    try:
        items = await usecase.execute(visitor_id, product_id)
    except CartItemNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товара нет в корзине",
        ) from error

    return build_cart_schema(items)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    visitor_id: str = Depends(get_visitor_id),
    cart: CartRepository = Depends(get_cart_repository),
) -> None:
    """Очистить корзину."""

    await cart.clear(visitor_id)
