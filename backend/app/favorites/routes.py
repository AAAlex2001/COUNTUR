from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.catalog.schemas import ProductCardSchema, ProductListSchema
from app.catalog.services.exceptions import ProductNotFoundError
from app.favorites.dependencies import (
    get_add_favorite_usecase,
    get_favorite_repository,
    get_remove_favorite_usecase,
)
from app.favorites.services.repo import FavoriteRepository
from app.favorites.services.usecases.add_favorite import AddFavoriteUseCase
from app.favorites.services.usecases.remove_favorite import RemoveFavoriteUseCase
from app.users.dependencies import require_user
from app.users.models import User

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("")
async def get_favorites(
    limit: int = Query(100, ge=1, le=200),
    offset: int = Query(0, ge=0),
    user: User = Depends(require_user),
    favorites: FavoriteRepository = Depends(get_favorite_repository),
) -> ProductListSchema:
    """Товары из избранного покупателя, недавно добавленные первыми."""

    products, total = await favorites.list_products(user.id, limit, offset)

    return ProductListSchema(
        products=[ProductCardSchema.model_validate(product) for product in products],
        total=total,
    )


@router.put("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def add_favorite(
    product_id: int,
    user: User = Depends(require_user),
    usecase: AddFavoriteUseCase = Depends(get_add_favorite_usecase),
) -> None:
    """Добавить товар в избранное."""

    try:
        await usecase.execute(user.id, product_id)
    except ProductNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден",
        ) from error


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_favorite(
    product_id: int,
    user: User = Depends(require_user),
    usecase: RemoveFavoriteUseCase = Depends(get_remove_favorite_usecase),
) -> None:
    """Убрать товар из избранного."""

    await usecase.execute(user.id, product_id)
