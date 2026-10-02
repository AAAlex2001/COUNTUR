"""Репозиторий корзины: только запросы к таблице cart_items."""

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.cart.models import CartItem
from app.catalog.models import Product
from app.catalog.services.repo import PUBLISHED


class CartRepository:
    """Доступ к таблице cart_items. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_items(self, visitor_id: str) -> list[CartItem]:
        """Позиции корзины посетителя в порядке добавления, только опубликованные товары."""

        stmt = (
            select(CartItem)
            .join(Product, Product.id == CartItem.product_id)
            .where(CartItem.visitor_id == visitor_id, PUBLISHED)
            .order_by(CartItem.created_at, CartItem.id)
        )
        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_item(self, visitor_id: str, product_id: int) -> CartItem | None:
        """Позиция с этим товаром в корзине посетителя или None."""

        stmt = select(CartItem).where(
            CartItem.visitor_id == visitor_id, CartItem.product_id == product_id
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

    async def clear(self, visitor_id: str) -> None:
        """Удалить все позиции корзины посетителя."""

        stmt = delete(CartItem).where(CartItem.visitor_id == visitor_id)
        await self.db.execute(stmt)
        await self.db.commit()
