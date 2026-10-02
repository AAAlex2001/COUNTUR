"""Сценарии работы с подборками: создание и изменение состава."""

from app.catalog.models import Product
from app.catalog.services.repo import ProductRepository
from app.collections.models import Collection
from app.collections.schemas import CollectionCreateSchema, CollectionUpdateSchema
from app.collections.services.exceptions import UnknownProductError
from app.collections.services.repo import CollectionRepository
from app.slugs import make_slug

NULLABLE_FIELDS = ("description",)


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

        changes = payload.model_dump(exclude_unset=True)
        product_ids = changes.pop("product_ids", None)

        products = None
        if product_ids is not None:
            products = await load_products(self.products, product_ids)

        if changes.get("slug"):
            changes["slug"] = await self.collections.unique_slug(
                changes["slug"], exclude_id=collection.id
            )

        for field, value in changes.items():
            if value is None and field not in NULLABLE_FIELDS:
                continue
            setattr(collection, field, value)

        if products is not None:
            collection.products = products

        return await self.collections.save(collection)
