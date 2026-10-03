"""Репозиторий избранного: только запросы к таблице favorites."""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import Product
from app.catalog.services.repo import PUBLISHED
from app.favorites.models import Favorite


class FavoriteRepository:
    """Доступ к таблице favorites. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_products(
        self, user_id: int, limit: int, offset: int
    ) -> tuple[list[Product], int]:
        """Опубликованные товары из избранного, недавно добавленные первыми, и их общее число."""

        conditions = [Favorite.user_id == user_id, PUBLISHED]

        products_stmt = (
            select(Product)
            .join(Favorite, Favorite.product_id == Product.id)
            .where(*conditions)
            .order_by(Favorite.created_at.desc(), Product.id.desc())
            .limit(limit)
            .offset(offset)
        )
        count_stmt = (
            select(func.count())
            .select_from(Favorite)
            .join(Product, Product.id == Favorite.product_id)
            .where(*conditions)
        )

        result = await self.db.execute(products_stmt)
        products = list(result.scalars().all())

        total = await self.db.scalar(count_stmt)
        if total is None:
            total = 0

        return products, total

    async def get(self, user_id: int, product_id: int) -> Favorite | None:
        """Запись избранного или None, если товара в избранном нет."""

        return await self.db.get(Favorite, (user_id, product_id))

    async def add(self, favorite: Favorite) -> None:
        """Сохранить товар в избранном."""

        self.db.add(favorite)
        await self.db.commit()

    async def remove(self, favorite: Favorite) -> None:
        """Убрать товар из избранного."""

        await self.db.delete(favorite)
        await self.db.commit()
