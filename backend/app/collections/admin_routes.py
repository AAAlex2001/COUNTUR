from fastapi import APIRouter, Depends, HTTPException, status

from app.admin.dependencies import require_admin
from app.collections.dependencies import (
    get_collection_by_id,
    get_collection_repository,
    get_create_collection_usecase,
    get_update_collection_usecase,
)
from app.collections.models import Collection
from app.collections.schemas import (
    CollectionAdminSchema,
    CollectionCreateSchema,
    CollectionUpdateSchema,
)
from app.collections.services.exceptions import UnknownProductError
from app.collections.services.repo import CollectionRepository
from app.collections.services.usecases.manage_collections import (
    CreateCollectionUseCase,
    UpdateCollectionUseCase,
)

router = APIRouter(
    prefix="/admin/collections",
    tags=["admin: collections"],
    dependencies=[Depends(require_admin)],
)


@router.get("")
async def list_collections(
    collections: CollectionRepository = Depends(get_collection_repository),
) -> list[CollectionAdminSchema]:
    """Все подборки, включая выключенные."""

    items = await collections.list_all()

    return [CollectionAdminSchema.model_validate(item) for item in items]


@router.get("/{collection_id}")
async def get_collection(collection: Collection = Depends(get_collection_by_id)) -> CollectionAdminSchema:
    """Подборка для редактирования."""

    return CollectionAdminSchema.model_validate(collection)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_collection(
    payload: CollectionCreateSchema,
    usecase: CreateCollectionUseCase = Depends(get_create_collection_usecase),
) -> CollectionAdminSchema:
    """Создание подборки."""

    try:
        collection = await usecase.execute(payload)
    except UnknownProductError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    return CollectionAdminSchema.model_validate(collection)


@router.patch("/{collection_id}")
async def update_collection(
    payload: CollectionUpdateSchema,
    collection: Collection = Depends(get_collection_by_id),
    usecase: UpdateCollectionUseCase = Depends(get_update_collection_usecase),
) -> CollectionAdminSchema:
    """Частичное обновление подборки и её состава."""

    try:
        updated = await usecase.execute(collection, payload)
    except UnknownProductError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    return CollectionAdminSchema.model_validate(updated)


@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_collection(
    collection: Collection = Depends(get_collection_by_id),
    collections: CollectionRepository = Depends(get_collection_repository),
) -> None:
    """Удаление подборки. Товары остаются в каталоге."""

    await collections.delete(collection)
