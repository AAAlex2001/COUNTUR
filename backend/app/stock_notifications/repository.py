from dataclasses import dataclass

from sqlalchemy import delete, func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import Availability, Product, PublicationStatus
from app.stock_notifications.models import StockSubscription
from app.users.models import User


@dataclass(frozen=True)
class StockNotice:
    """Подписка и адресат письма о поступлении."""

    subscription: StockSubscription
    email: str
    product_name: str
    product_slug: str


class StockSubscriptionRepository:
    """Читает и сохраняет подписки на поступление товаров."""

    def __init__(self, db: AsyncSession) -> None:
        """Подключить хранилище подписок."""

        self.db = db

    async def list_product_ids(self, user_id: int) -> list[int]:
        """Возвращает товары с активной подпиской покупателя."""

        query = select(StockSubscription.product_id).where(StockSubscription.user_id == user_id)
        return list(await self.db.scalars(query))

    async def add(self, user_id: int, product_id: int) -> None:
        """Создаёт одну подписку даже при повторном запросе."""

        query = insert(StockSubscription).values(user_id=user_id, product_id=product_id)
        await self.db.execute(query.on_conflict_do_nothing())
        await self.db.commit()

    async def remove(self, user_id: int, product_id: int) -> None:
        """Удаляет подписку только у указанного покупателя."""

        query = delete(StockSubscription).where(
            StockSubscription.user_id == user_id,
            StockSubscription.product_id == product_id,
        )
        await self.db.execute(query)
        await self.db.commit()

    async def next_notice(self) -> StockNotice | None:
        """Заблокировать следующее уведомление."""

        query = (
            select(StockSubscription, User.email, Product.name, Product.slug)
            .join(User, User.id == StockSubscription.user_id)
            .join(Product, Product.id == StockSubscription.product_id)
            .where(
                Product.status == PublicationStatus.PUBLISHED,
                Product.availability == Availability.IN_STOCK,
                StockSubscription.next_attempt_at <= func.now(),
            )
            .order_by(
                StockSubscription.next_attempt_at,
                StockSubscription.product_id,
                StockSubscription.user_id,
            )
            .limit(1)
            .with_for_update(skip_locked=True, of=StockSubscription)
        )
        row = (await self.db.execute(query)).one_or_none()
        if row is None:
            return None

        subscription, email, product_name, product_slug = row
        return StockNotice(subscription, email, product_name, product_slug)

    async def mark_notified(self, subscription: StockSubscription) -> None:
        """Закрыть подписку после отправки письма."""

        await self.db.delete(subscription)
