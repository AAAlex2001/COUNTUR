"""Подборки: репозиторий, фабрики сценариев и загрузка подборки по id из пути."""

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.dependencies import get_product_repository
from app.catalog.repositories.products import ProductRepository
from app.collections.models import Collection
from app.collections.repository import CollectionRepository
from app.collections.usecases.manage_collections import (
    CreateCollectionUseCase,
    UpdateCollectionUseCase,
)
from app.database import get_session


def get_collection_repository(
    session: AsyncSession = Depends(get_session),
) -> CollectionRepository:
    """Репозиторий подборок с сессией текущего запроса."""

    return CollectionRepository(session)


async def get_collection_by_id(
    collection_id: int,
    collections: CollectionRepository = Depends(get_collection_repository),
) -> Collection:
    """Подборка по id из пути для админки. Отсутствующая — 404."""

    collection = await collections.get_by_id(collection_id)
    if collection is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Подборка не найдена",
        )

    return collection


async def get_collection_for_edit(
    collection_id: int,
    collections: CollectionRepository = Depends(get_collection_repository),
) -> Collection:
    """Открыть подборку для изменения."""

    collection = await collections.lock_by_id(collection_id)
    if collection is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Подборка не найдена",
        )

    return collection


def get_create_collection_usecase(
    collections: CollectionRepository = Depends(get_collection_repository),
    products: ProductRepository = Depends(get_product_repository),
) -> CreateCollectionUseCase:
    """Сценарий создания подборки."""

    return CreateCollectionUseCase(collections, products)


def get_update_collection_usecase(
    collections: CollectionRepository = Depends(get_collection_repository),
    products: ProductRepository = Depends(get_product_repository),
) -> UpdateCollectionUseCase:
    """Сценарий изменения подборки."""

    return UpdateCollectionUseCase(collections, products)
