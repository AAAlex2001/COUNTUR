from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import Brand
from app.locks import lock_unique_value
from app.slugs import make_slug, unique_slug


class BrandRepository:
    """Доступ к таблице brands. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_all(self) -> list[Brand]:
        """Все бренды по алфавиту."""

        stmt = select(Brand).order_by(Brand.name)
        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_by_id(self, brand_id: int) -> Brand | None:
        """Бренд по идентификатору или None."""

        return await self.db.get(Brand, brand_id)

    async def get_or_create(self, name: str) -> Brand:
        """Бренд с таким названием без учёта регистра, а если его нет — новый.
        Новый не коммитится: он сохранится вместе с товаром."""

        name = name.strip()
        await lock_unique_value(self.db, "slug", Brand.__tablename__)
        stmt = select(Brand).where(func.lower(Brand.name) == name.lower())
        brand = await self.db.scalar(stmt.order_by(Brand.id).limit(1))

        if brand is None:
            brand = Brand(name=name, slug=await self.unique_slug(make_slug(name)))
            self.db.add(brand)
            await self.db.flush()

        return brand

    async def unique_slug(self, wanted: str, exclude_id: int | None = None) -> str:
        """Свободный slug бренда на основе wanted."""

        return await unique_slug(self.db, Brand, wanted, exclude_id)

    async def add(self, brand: Brand) -> Brand:
        """Сохранить новый бренд."""

        self.db.add(brand)
        await self.db.commit()

        return brand

    async def save(self, brand: Brand) -> Brand:
        """Сохранить изменения существующего бренда."""

        await self.db.commit()

        return brand

    async def delete(self, brand: Brand) -> None:
        """Удалить бренд. У его товаров бренд становится пустым."""

        await self.db.delete(brand)
        await self.db.commit()
