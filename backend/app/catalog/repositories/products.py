from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.filters import PRODUCT_SORTS, AdminProductFilters, ProductFilters, build_conditions
from app.catalog.models import Product, PublicationStatus
from app.locks import lock_unique_value
from app.slugs import unique_slug


class ProductRepository:
    """Товары каталога."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_published(
        self, filters: ProductFilters, sort: str, limit: int, offset: int
    ) -> list[Product]:
        """Получить страницу каталога."""

        ordering = PRODUCT_SORTS.get(sort, PRODUCT_SORTS["popular"])
        query = (
            select(Product)
            .where(*build_conditions(filters))
            .order_by(*ordering, Product.id)
            .limit(limit)
            .offset(offset)
        )
        return list(await self.db.scalars(query))

    async def count_published(self, filters: ProductFilters) -> int:
        """Посчитать товары каталога."""

        query = select(func.count()).select_from(Product).where(*build_conditions(filters))
        return await self.db.scalar(query) or 0

    async def list_published_slugs(self) -> list[tuple[str, datetime]]:
        """Получить адреса и даты изменения опубликованных товаров."""

        query = (
            select(Product.slug, Product.updated_at)
            .where(Product.status == PublicationStatus.PUBLISHED)
            .order_by(Product.id)
        )
        result = await self.db.execute(query)

        return [(slug, updated_at) for slug, updated_at in result.all()]

    async def get_published(self, slug: str) -> Product | None:
        """Найти опубликованный товар по адресу."""

        query = select(Product).where(
            Product.slug == slug, Product.status == PublicationStatus.PUBLISHED
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def get_published_by_id(self, product_id: int, lock: bool = False) -> Product | None:
        """Найти опубликованный товар по идентификатору."""

        query = select(Product).where(
            Product.id == product_id, Product.status == PublicationStatus.PUBLISHED
        )
        if lock:
            query = query.with_for_update()

        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def lock_published(self, product_ids: list[int]) -> list[Product]:
        """Заблокировать опубликованные товары заказа."""

        query = (
            select(Product)
            .where(Product.id.in_(product_ids), Product.status == PublicationStatus.PUBLISHED)
            .order_by(Product.id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(query)

        return list(result.scalars().all())

    async def list_all(
        self, filters: AdminProductFilters, limit: int, offset: int
    ) -> list[Product]:
        """Получить товары для админки."""

        query = (
            select(Product)
            .where(*filters.conditions())
            .order_by(Product.sort_order, Product.name, Product.id)
            .limit(limit)
            .offset(offset)
        )
        return list(await self.db.scalars(query))

    async def count_all(self, filters: AdminProductFilters) -> int:
        """Посчитать товары для админки."""

        query = select(func.count()).select_from(Product).where(*filters.conditions())
        return await self.db.scalar(query) or 0

    async def list_by_ids(self, product_ids: list[int], lock: bool = False) -> list[Product]:
        """Получить товары по идентификаторам, включая черновики."""

        if not product_ids:
            return []

        query = select(Product).where(Product.id.in_(product_ids))
        if lock:
            query = (
                query.order_by(Product.id)
                .with_for_update()
                .execution_options(populate_existing=True)
            )

        result = await self.db.execute(query)

        return list(result.scalars().all())

    async def get_by_id(self, product_id: int) -> Product | None:
        """Товар по идентификатору для админки, черновики тоже."""

        return await self.db.get(Product, product_id)

    async def lock_by_id(self, product_id: int) -> Product | None:
        """Открыть товар для изменения."""

        return await self.db.get(Product, product_id, with_for_update=True, populate_existing=True)

    async def reserve_sku(self, sku: str, exclude_id: int | None = None) -> bool:
        """Зарезервировать свободный артикул."""

        await lock_unique_value(self.db, "products.sku", sku)
        query = select(Product.id).where(Product.sku == sku)
        if exclude_id is not None:
            query = query.where(Product.id != exclude_id)

        return await self.db.scalar(query) is None

    async def unique_slug(self, wanted: str, exclude_id: int | None = None) -> str:
        """Свободный slug товара на основе wanted."""

        return await unique_slug(self.db, Product, wanted, exclude_id)

    async def add(self, product: Product) -> Product:
        """Сохранить новый товар и вернуть его перечитанным из базы."""

        self.db.add(product)
        return await self.save(product)

    async def save(self, product: Product) -> Product:
        """Сохранить изменения существующего товара и вернуть его перечитанным."""

        await self.db.flush()
        updated = await self.reload(product.id)
        await self.db.commit()
        return updated

    async def delete(self, product: Product) -> None:
        """Удалить товар и связанные записи."""

        await self.db.delete(product)
        await self.db.commit()

    async def reload(self, product_id: int) -> Product:
        """Перечитать товар из базы после записи вместе со связями."""

        query = (
            select(Product)
            .where(Product.id == product_id)
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(query)

        return result.scalar_one()
