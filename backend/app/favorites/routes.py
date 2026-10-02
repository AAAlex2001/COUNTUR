from fastapi import APIRouter, Depends, HTTPException, status

from app.catalog.schemas import ProductCardSchema
from app.catalog.services.exceptions import ProductNotFoundError
from app.favorites.dependencies import (
    get_add_favorite_usecase,
    get_favorite_repository,
    get_remove_favorite_usecase,
)
from app.favorites.services.repo import FavoriteRepository
from app.favorites.services.usecases.add_favorite import AddFavoriteUseCase
from app.favorites.services.usecases.remove_favorite import RemoveFavoriteUseCase
from app.visitor import get_visitor_id

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("")
async def get_favorites(
    visitor_id: str = Depends(get_visitor_id),
    favorites: FavoriteRepository = Depends(get_favorite_repository),
) -> list[ProductCardSchema]:
    """Товары из избранного посетителя."""

    products = await favorites.list_products(visitor_id)

    return [ProductCardSchema.model_validate(product) for product in products]


@router.put("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def add_favorite(
    product_id: int,
    visitor_id: str = Depends(get_visitor_id),
    usecase: AddFavoriteUseCase = Depends(get_add_favorite_usecase),
) -> None:
    """Добавить товар в избранное."""

    try:
        await usecase.execute(visitor_id, product_id)
    except ProductNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден",
        ) from error


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_favorite(
    product_id: int,
    visitor_id: str = Depends(get_visitor_id),
    usecase: RemoveFavoriteUseCase = Depends(get_remove_favorite_usecase),
) -> None:
    """Убрать товар из избранного."""

    await usecase.execute(visitor_id, product_id)
