"""Репозиторий избранного: только запросы к таблице favorites."""

from sqlalchemy import delete, func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import Product, PublicationStatus
from app.favorites.models import Favorite


class FavoriteRepository:
    """Доступ к таблице favorites. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_products(self, user_id: int, limit: int, offset: int) -> list[Product]:
        """Получить избранные товары."""

        query = (
            select(Product)
            .join(Favorite, Favorite.product_id == Product.id)
            .where(Favorite.user_id == user_id, Product.status == PublicationStatus.PUBLISHED)
            .order_by(Favorite.created_at.desc(), Product.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(await self.db.scalars(query))

    async def count_products(self, user_id: int) -> int:
        """Посчитать избранные товары."""

        query = (
            select(func.count())
            .select_from(Favorite)
            .join(Product, Product.id == Favorite.product_id)
            .where(Favorite.user_id == user_id, Product.status == PublicationStatus.PUBLISHED)
        )
        return await self.db.scalar(query) or 0

    async def add(self, user_id: int, product_id: int) -> None:
        """Добавить товар в избранное."""

        query = insert(Favorite).values(user_id=user_id, product_id=product_id)
        await self.db.execute(query.on_conflict_do_nothing())
        await self.db.commit()

    async def remove(self, user_id: int, product_id: int) -> None:
        """Убрать товар из избранного."""

        query = delete(Favorite).where(
            Favorite.user_id == user_id, Favorite.product_id == product_id
        )
        await self.db.execute(query)
        await self.db.commit()
