"""Избранное: репозиторий и фабрики сценариев."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.dependencies import get_product_repository
from app.catalog.repositories.products import ProductRepository
from app.database import get_session
from app.favorites.repository import FavoriteRepository
from app.favorites.usecases.add_favorite import AddFavoriteUseCase
from app.favorites.usecases.remove_favorite import RemoveFavoriteUseCase


def get_favorite_repository(
    session: AsyncSession = Depends(get_session),
) -> FavoriteRepository:
    """Репозиторий избранного с сессией текущего запроса."""

    return FavoriteRepository(session)


def get_add_favorite_usecase(
    favorites: FavoriteRepository = Depends(get_favorite_repository),
    products: ProductRepository = Depends(get_product_repository),
) -> AddFavoriteUseCase:
    """Сценарий добавления в избранное."""

    return AddFavoriteUseCase(favorites, products)


def get_remove_favorite_usecase(
    favorites: FavoriteRepository = Depends(get_favorite_repository),
) -> RemoveFavoriteUseCase:
    """Сценарий удаления из избранного."""

    return RemoveFavoriteUseCase(favorites)
