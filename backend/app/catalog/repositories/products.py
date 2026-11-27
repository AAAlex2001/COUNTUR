from datetime import datetime
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.filters import PRODUCT_SORTS, AdminProductFilters, ProductFilters, build_conditions
from app.catalog.models import Attribute, Brand, Product, ProductSpec, PublicationStatus
from app.locks import lock_unique_value
from app.slugs import unique_slug


class ProductRepository:
    """Доступ к таблице products. Сессию получает снаружи, коммитит сам."""

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
        """Адреса всех опубликованных товаров с датой изменения. Для карты сайта."""

        stmt = (
            select(Product.slug, Product.updated_at)
            .where(Product.status == PublicationStatus.PUBLISHED)
            .order_by(Product.id)
        )
        result = await self.db.execute(stmt)

        return [(slug, updated_at) for slug, updated_at in result.all()]

    async def get_published(self, slug: str) -> Product | None:
        """Опубликованный товар по slug. Черновик считается ненайденным."""

        stmt = select(Product).where(
            Product.slug == slug, Product.status == PublicationStatus.PUBLISHED
        )
        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def get_published_by_id(self, product_id: int, lock: bool = False) -> Product | None:
        """Опубликованный товар по идентификатору, черновик — ненайденный. С lock — под блокировкой."""

        stmt = select(Product).where(
            Product.id == product_id, Product.status == PublicationStatus.PUBLISHED
        )
        if lock:
            stmt = stmt.with_for_update()

        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def lock_published(self, product_ids: list[int]) -> list[Product]:
        """Опубликованные товары с блокировкой строк до конца транзакции. Для оформления заказа."""

        stmt = (
            select(Product)
            .where(Product.id.in_(product_ids), Product.status == PublicationStatus.PUBLISHED)
            .order_by(Product.id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(stmt)

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
        """Товары по списку идентификаторов, включая черновики. С lock — под блокировкой строк."""

        if not product_ids:
            return []

        stmt = select(Product).where(Product.id.in_(product_ids))
        if lock:
            stmt = (
                stmt.order_by(Product.id)
                .with_for_update()
                .execution_options(populate_existing=True)
            )

        result = await self.db.execute(stmt)

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
        stmt = select(Product.id).where(Product.sku == sku)
        if exclude_id is not None:
            stmt = stmt.where(Product.id != exclude_id)

        return await self.db.scalar(stmt) is None

    async def unique_slug(self, wanted: str, exclude_id: int | None = None) -> str:
        """Свободный slug товара на основе wanted."""

        return await unique_slug(self.db, Product, wanted, exclude_id)

    async def price_bounds(self, category_id: int | None) -> tuple[Decimal | None, Decimal | None]:
        """Самая низкая и самая высокая цена среди опубликованных товаров."""

        stmt = select(func.min(Product.price), func.max(Product.price)).where(
            Product.status == PublicationStatus.PUBLISHED
        )
        if category_id is not None:
            stmt = stmt.where(Product.category_id == category_id)

        result = await self.db.execute(stmt)
        price_min, price_max = result.one()

        return price_min, price_max

    async def list_brands(self, category_id: int | None) -> list[Brand]:
        """Бренды, у которых есть опубликованные товары, по алфавиту."""

        brand_ids = select(Product.brand_id).where(
            Product.status == PublicationStatus.PUBLISHED, Product.brand_id.is_not(None)
        )
        if category_id is not None:
            brand_ids = brand_ids.where(Product.category_id == category_id)

        stmt = select(Brand).where(Brand.id.in_(brand_ids)).order_by(Brand.name)
        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def list_spec_values(self, category_id: int) -> list[tuple[int, str]]:
        """Пары (id параметра, значение) опубликованных товаров категории для фильтров."""

        stmt = (
            select(ProductSpec.attribute_id, ProductSpec.value)
            .join(Product, Product.id == ProductSpec.product_id)
            .join(Attribute, Attribute.id == ProductSpec.attribute_id)
            .where(
                Product.status == PublicationStatus.PUBLISHED,
                Product.category_id == category_id,
                Attribute.is_filterable.is_(True),
            )
            .distinct()
        )
        result = await self.db.execute(stmt)

        return [(attribute_id, value) for attribute_id, value in result.all()]

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
        """Удалить товар. Фото, характеристики, отзывы и позиции корзин удаляются каскадом."""

        await self.db.delete(product)
        await self.db.commit()

    async def reload(self, product_id: int) -> Product:
        """Перечитать товар из базы после записи вместе со связями."""

        stmt = (
            select(Product)
            .where(Product.id == product_id)
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(stmt)

        return result.scalar_one()
