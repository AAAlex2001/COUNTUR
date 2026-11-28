from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import Attribute, Brand, Product, ProductSpec, PublicationStatus


class CatalogFilterRepository:
    """Варианты фильтров опубликованных товаров."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def price_bounds(self, category_id: int | None) -> tuple[Decimal | None, Decimal | None]:
        """Самая низкая и самая высокая цена среди опубликованных товаров."""

        query = select(func.min(Product.price), func.max(Product.price)).where(
            Product.status == PublicationStatus.PUBLISHED
        )
        if category_id is not None:
            query = query.where(Product.category_id == category_id)

        result = await self.db.execute(query)
        price_min, price_max = result.one()

        return price_min, price_max

    async def list_brands(self, category_id: int | None) -> list[Brand]:
        """Бренды, у которых есть опубликованные товары, по алфавиту."""

        brand_ids = select(Product.brand_id).where(
            Product.status == PublicationStatus.PUBLISHED, Product.brand_id.is_not(None)
        )
        if category_id is not None:
            brand_ids = brand_ids.where(Product.category_id == category_id)

        query = select(Brand).where(Brand.id.in_(brand_ids)).order_by(Brand.name)
        result = await self.db.execute(query)

        return list(result.scalars().all())

    async def list_spec_values(self, category_id: int) -> list[tuple[int, str]]:
        """Пары (id параметра, значение) опубликованных товаров категории для фильтров."""

        query = (
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
        result = await self.db.execute(query)

        return [(attribute_id, value) for attribute_id, value in result.all()]
