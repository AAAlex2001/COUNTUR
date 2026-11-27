from dataclasses import dataclass
from datetime import datetime

from sqlalchemy import ColumnElement, func, select, true
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.orders.models import Order, OrderStatus


@dataclass(frozen=True)
class OrderFilter:
    """Фильтр заказов."""

    user_id: int | None = None
    number: int | None = None
    status: OrderStatus | None = None
    period: tuple[datetime, datetime] | None = None

    def matches(self) -> ColumnElement[bool]:
        """Отобрать подходящие заказы."""

        condition = true()
        if self.user_id is not None:
            condition &= Order.user_id == self.user_id
        if self.number is not None:
            condition &= Order.id == self.number
        if self.status is not None:
            condition &= Order.status == self.status
        if self.period is not None:
            start, end = self.period
            condition &= (Order.created_at >= start) & (Order.created_at < end)
        return condition


class OrderRepository:
    """Заказы покупателей."""

    def __init__(self, db: AsyncSession) -> None:
        """Подключить хранилище заказов."""

        self.db = db

    async def add(self, order: Order) -> None:
        """Присвоить заказу номер."""

        self.db.add(order)
        await self.db.flush()

    async def get_for_user(self, order_id: int, user_id: int) -> Order | None:
        """Найти заказ покупателя."""

        query = select(Order).where(Order.id == order_id, Order.user_id == user_id)
        return await self.db.scalar(query)

    async def get_by_id(self, order_id: int) -> Order | None:
        """Найти заказ по номеру."""

        return await self.db.get(Order, order_id)

    async def list_orders(self, filters: OrderFilter, limit: int, offset: int) -> list[Order]:
        """Получить страницу заказов."""

        query = (
            select(Order)
            .where(filters.matches())
            .order_by(Order.created_at.desc(), Order.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(await self.db.scalars(query))

    async def count_orders(self, filters: OrderFilter) -> int:
        """Посчитать заказы."""

        query = select(func.count()).select_from(Order).where(filters.matches())
        return await self.db.scalar(query) or 0

    async def lock_by_id(self, order_id: int) -> Order | None:
        """Заблокировать заказ для изменения."""

        query = (
            select(Order)
            .where(Order.id == order_id)
            .options(joinedload(Order.buyer))
            .with_for_update(of=Order)
            .execution_options(populate_existing=True)
        )
        return await self.db.scalar(query)

    async def save(self, order: Order) -> Order:
        """Сохранить заказ."""

        query = select(Order).where(Order.id == order.id).execution_options(populate_existing=True)
        saved_order = (await self.db.scalars(query)).one()
        await self.db.commit()
        return saved_order
