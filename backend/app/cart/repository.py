"""Репозиторий корзины: только запросы к таблице cart_items."""

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.cart.models import CartItem
from app.catalog.models import Product, PublicationStatus
from app.users.models import User


class CartRepository:
    """Доступ к таблице cart_items. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def lock_owner(self, user_id: int) -> User:
        """Заблокировать корзину покупателя."""

        query = (
            select(User)
            .where(User.id == user_id)
            .with_for_update(key_share=True)
            .execution_options(populate_existing=True)
        )
        return (await self.db.scalars(query)).one()

    async def list_items(self, user_id: int) -> list[CartItem]:
        """Получить товары корзины."""

        stmt = (
            select(CartItem)
            .join(Product, Product.id == CartItem.product_id)
            .where(CartItem.user_id == user_id, Product.status == PublicationStatus.PUBLISHED)
            .order_by(CartItem.created_at, CartItem.id)
        )
        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def page_items(self, user_id: int, limit: int, offset: int) -> list[CartItem]:
        """Получить страницу корзины."""

        query = (
            select(CartItem)
            .join(Product, Product.id == CartItem.product_id)
            .where(CartItem.user_id == user_id, Product.status == PublicationStatus.PUBLISHED)
            .order_by(CartItem.created_at, CartItem.id)
            .limit(limit)
            .offset(offset)
        )
        return list(await self.db.scalars(query))

    async def count_items(self, user_id: int) -> int:
        """Посчитать позиции корзины."""

        query = (
            select(func.count())
            .select_from(CartItem)
            .join(Product, Product.id == CartItem.product_id)
            .where(CartItem.user_id == user_id, Product.status == PublicationStatus.PUBLISHED)
        )
        return await self.db.scalar(query) or 0

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

    async def remove_items(self, user_id: int) -> None:
        """Удалить позиции покупателя."""

        stmt = delete(CartItem).where(CartItem.user_id == user_id)
        await self.db.execute(stmt)

    async def clear(self, user_id: int) -> None:
        """Очистить корзину покупателя."""

        await self.lock_owner(user_id)
        await self.remove_items(user_id)
        await self.db.commit()
