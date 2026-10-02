"""Репозиторий избранного: только запросы к таблице favorites."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import Product
from app.catalog.services.repo import PUBLISHED
from app.favorites.models import Favorite


class FavoriteRepository:
    """Доступ к таблице favorites. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_products(self, visitor_id: str) -> list[Product]:
        """Опубликованные товары из избранного посетителя, недавно добавленные первыми."""

        stmt = (
            select(Product)
            .join(Favorite, Favorite.product_id == Product.id)
            .where(Favorite.visitor_id == visitor_id, PUBLISHED)
            .order_by(Favorite.created_at.desc(), Product.id.desc())
        )
        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get(self, visitor_id: str, product_id: int) -> Favorite | None:
        """Запись избранного или None, если товара в избранном нет."""

        return await self.db.get(Favorite, (visitor_id, product_id))

    async def add(self, favorite: Favorite) -> None:
        """Сохранить товар в избранном."""

        self.db.add(favorite)
        await self.db.commit()

    async def remove(self, favorite: Favorite) -> None:
        """Убрать товар из избранного."""

        await self.db.delete(favorite)
        await self.db.commit()
