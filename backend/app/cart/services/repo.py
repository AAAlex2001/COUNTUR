"""Репозиторий корзины: только запросы к таблице cart_items."""

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.cart.models import CartItem
from app.catalog.models import Product
from app.catalog.services.repo import PUBLISHED


class CartRepository:
    """Доступ к таблице cart_items. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_items(self, user_id: int, lock: bool = False) -> list[CartItem]:
        """Позиции корзины покупателя, только опубликованные товары. С lock — под блокировкой строк."""

        stmt = (
            select(CartItem)
            .join(Product, Product.id == CartItem.product_id)
            .where(CartItem.user_id == user_id, PUBLISHED)
            .order_by(CartItem.created_at, CartItem.id)
        )
        if lock:
            stmt = stmt.with_for_update(of=CartItem)

        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def page_items(
        self, user_id: int, limit: int, offset: int
    ) -> tuple[list[CartItem], int]:
        """Страница корзины покупателя для админки и общее число позиций."""

        conditions = [CartItem.user_id == user_id, PUBLISHED]

        items_stmt = (
            select(CartItem)
            .join(Product, Product.id == CartItem.product_id)
            .where(*conditions)
            .order_by(CartItem.created_at, CartItem.id)
            .limit(limit)
            .offset(offset)
        )
        count_stmt = (
            select(func.count())
            .select_from(CartItem)
            .join(Product, Product.id == CartItem.product_id)
            .where(*conditions)
        )

        result = await self.db.execute(items_stmt)
        items = list(result.scalars().all())

        total = await self.db.scalar(count_stmt)
        if total is None:
            total = 0

        return items, total

    async def get_item(self, user_id: int, product_id: int) -> CartItem | None:
        """Позиция с этим товаром в корзине покупателя или None."""

        stmt = select(CartItem).where(
            CartItem.user_id == user_id, CartItem.product_id == product_id
        )
        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def add(self, item: CartItem) -> None:
        """Сохранить новую позицию."""

        self.db.add(item)
        await self.db.commit()

    async def save(self) -> None:
        """Сохранить изменения существующих позиций."""

        await self.db.commit()

    async def remove(self, item: CartItem) -> None:
        """Удалить позицию."""

        await self.db.delete(item)
        await self.db.commit()

    async def clear(self, user_id: int) -> None:
        """Удалить все позиции корзины покупателя."""

        stmt = delete(CartItem).where(CartItem.user_id == user_id)
        await self.db.execute(stmt)
        await self.db.commit()
