from sqlalchemy import func, or_, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased, joinedload

from app.orders.models import Order, OrderMail, OrderMailKind
from app.users.models import User


class OrderMailQueue:
    """Очередь писем о заказах."""

    def __init__(self, db: AsyncSession) -> None:
        """Подключить очередь писем."""

        self.db = db

    async def enqueue(self, order: Order, kind: OrderMailKind, reference: str = "") -> None:
        """Поставить письмо в очередь."""

        enabled = await self.db.scalar(select(User.notify_orders).where(User.id == order.user_id))
        if not enabled:
            return

        await self.db.execute(
            insert(OrderMail)
            .values(order_id=order.id, kind=kind, reference=reference)
            .on_conflict_do_nothing()
        )

    async def next_pending(self) -> OrderMail | None:
        """Взять следующее письмо."""

        confirmation = aliased(OrderMail)
        awaits_confirmation = (
            select(confirmation.order_id)
            .where(
                confirmation.order_id == OrderMail.order_id,
                confirmation.kind == OrderMailKind.CONFIRMATION,
                confirmation.sent_at.is_(None),
            )
            .exists()
        )

        statement = (
            select(OrderMail)
            .options(joinedload(OrderMail.order).joinedload(Order.buyer))
            .where(OrderMail.sent_at.is_(None), OrderMail.next_attempt_at <= func.now())
            .where(or_(OrderMail.kind == OrderMailKind.CONFIRMATION, ~awaits_confirmation))
            .order_by(OrderMail.next_attempt_at, OrderMail.order_id, OrderMail.kind)
            .limit(1)
            .with_for_update(skip_locked=True, of=OrderMail)
        )
        return await self.db.scalar(statement)

    async def discard(self, job: OrderMail) -> None:
        """Снять письмо с очереди."""

        await self.db.delete(job)
