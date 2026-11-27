"""Сценарии работы с подборками: создание и изменение состава."""

from app.catalog.models import Product
from app.catalog.repositories.products import ProductRepository
from app.collections.exceptions import UnknownProductError
from app.collections.models import Collection
from app.collections.repository import CollectionRepository
from app.collections.schemas import CollectionCreateSchema, CollectionUpdateSchema
from app.slugs import make_slug


async def load_products(products: ProductRepository, product_ids: list[int]) -> list[Product]:
    """Найти товары для состава подборки. Бросает UnknownProductError, если какого-то нет."""

    unique_ids = list(dict.fromkeys(product_ids))
    found = await products.list_by_ids(unique_ids)

    if len(found) != len(unique_ids):
        raise UnknownProductError("В подборке указан несуществующий товар")

    return found


class CreateCollectionUseCase:
    """Создать подборку с заданным составом. Без slug он составляется из названия."""

    def __init__(self, collections: CollectionRepository, products: ProductRepository) -> None:
        self.collections = collections
        self.products = products

    async def execute(self, payload: CollectionCreateSchema) -> Collection:
        """Вернуть сохранённую подборку. Бросает UnknownProductError."""

        products = await load_products(self.products, payload.product_ids)
        slug = await self.collections.unique_slug(payload.slug or make_slug(payload.title))

        collection = Collection(
            slug=slug,
            title=payload.title,
            description=payload.description,
            show_on_home=payload.show_on_home,
            show_in_catalog=payload.show_in_catalog,
            is_active=payload.is_active,
            sort_order=payload.sort_order,
            products=products,
        )

        return await self.collections.add(collection)


class UpdateCollectionUseCase:
    """Частично обновить подборку: настройки показа и состав."""

    def __init__(self, collections: CollectionRepository, products: ProductRepository) -> None:
        self.collections = collections
        self.products = products

    async def execute(self, collection: Collection, payload: CollectionUpdateSchema) -> Collection:
        """Вернуть обновлённую подборку. Бросает UnknownProductError."""

        if payload.product_ids is not None:
            collection.products = await load_products(self.products, payload.product_ids)
        if payload.slug is not None:
            collection.slug = await self.collections.unique_slug(
                payload.slug, exclude_id=collection.id
            )
        if payload.title is not None:
            collection.title = payload.title
        if "description" in payload.model_fields_set:
            collection.description = payload.description
        if payload.show_on_home is not None:
            collection.show_on_home = payload.show_on_home
        if payload.show_in_catalog is not None:
            collection.show_in_catalog = payload.show_in_catalog
        if payload.is_active is not None:
            collection.is_active = payload.is_active
        if payload.sort_order is not None:
            collection.sort_order = payload.sort_order

        return await self.collections.save(collection)
