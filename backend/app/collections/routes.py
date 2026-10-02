from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.collections.dependencies import get_collection_repository
from app.collections.schemas import CollectionSchema, Placement
from app.collections.services.repo import CollectionRepository

router = APIRouter(prefix="/collections", tags=["collections"])


@router.get("")
async def get_collections(
    placement: Placement | None = Query(None, description="Где показывается: home или catalog"),
    collections: CollectionRepository = Depends(get_collection_repository),
) -> list[CollectionSchema]:
    """Подборки с товарами. Подборки без опубликованных товаров не отдаются."""

    items = await collections.list_active(placement)

    return [CollectionSchema.model_validate(item) for item in items if item.published_products]


@router.get("/{slug}")
async def get_collection(
    slug: str,
    collections: CollectionRepository = Depends(get_collection_repository),
) -> CollectionSchema:
    """Одна подборка с товарами."""

    collection = await collections.get_active(slug)
    if collection is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Подборка не найдена",
        )

    return CollectionSchema.model_validate(collection)
