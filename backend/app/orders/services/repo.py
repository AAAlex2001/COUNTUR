"""Репозиторий заказов: только запросы к таблицам orders и order_items."""

from datetime import datetime

from sqlalchemy import ColumnElement, delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.cart.models import CartItem
from app.orders.models import Order


class OrderRepository:
    """Доступ к таблице orders. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, order: Order, visitor_id: str) -> Order:
        """Сохранить заказ и очистить корзину одной транзакцией со списанием остатков."""

        self.db.add(order)
        await self.db.execute(delete(CartItem).where(CartItem.visitor_id == visitor_id))
        await self.db.commit()

        return await self.reload(order.id)

    async def get_for_visitor(self, order_id: int, visitor_id: str) -> Order | None:
        """Заказ по номеру, но только если его оформил этот посетитель."""

        stmt = select(Order).where(Order.id == order_id, Order.visitor_id == visitor_id)
        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def get_by_id(self, order_id: int) -> Order | None:
        """Заказ по номеру для админки или None."""

        return await self.db.get(Order, order_id)

    async def list_all(
        self,
        number: int | None,
        created_from: datetime | None,
        created_to: datetime | None,
        status: str | None,
        limit: int,
        offset: int,
    ) -> tuple[list[Order], int]:
        """Заказы для админки, свежие первыми, и их общее количество."""

        conditions: list[ColumnElement[bool]] = []

        if number is not None:
            conditions.append(Order.id == number)

        if created_from is not None:
            conditions.append(Order.created_at >= created_from)

        if created_to is not None:
            conditions.append(Order.created_at < created_to)

        if status:
            conditions.append(Order.status == status)

        orders_stmt = (
            select(Order)
            .where(*conditions)
            .order_by(Order.created_at.desc(), Order.id.desc())
            .limit(limit)
            .offset(offset)
        )
        count_stmt = select(func.count()).select_from(Order).where(*conditions)

        result = await self.db.execute(orders_stmt)
        orders = list(result.scalars().all())

        total = await self.db.scalar(count_stmt)
        if total is None:
            total = 0

        return orders, total

    async def save(self, order: Order) -> Order:
        """Сохранить изменения заказа и вернуть его перечитанным из базы."""

        await self.db.commit()

        return await self.reload(order.id)

    async def reload(self, order_id: int) -> Order:
        """Перечитать заказ из базы после записи вместе с позициями."""

        stmt = (
            select(Order).where(Order.id == order_id).execution_options(populate_existing=True)
        )
        result = await self.db.execute(stmt)

        return result.scalar_one()
