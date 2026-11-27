from sqlalchemy import delete, func, select, true
from sqlalchemy.ext.asyncio import AsyncSession

from app.feedback.models import FeedbackMessage, FeedbackStatus


class FeedbackRepository:
    """Обращения покупателей."""

    def __init__(self, db: AsyncSession) -> None:
        """Подключить обращения."""

        self.db = db

    async def list_messages(
        self, status: FeedbackStatus | None, limit: int, offset: int
    ) -> list[FeedbackMessage]:
        """Получить страницу обращений."""

        query = (
            select(FeedbackMessage)
            .where(FeedbackMessage.status == status if status else true())
            .order_by(FeedbackMessage.created_at.desc(), FeedbackMessage.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(await self.db.scalars(query))

    async def count_messages(self, status: FeedbackStatus | None) -> int:
        """Посчитать обращения."""

        query = select(func.count()).select_from(FeedbackMessage)
        if status is not None:
            query = query.where(FeedbackMessage.status == status)
        return await self.db.scalar(query) or 0

    async def get_by_id(self, message_id: int) -> FeedbackMessage | None:
        """Найти обращение."""

        return await self.db.get(FeedbackMessage, message_id)

    async def lock_for_reply(self, message_id: int) -> FeedbackMessage | None:
        """Заблокировать обращение для ответа."""

        return await self.db.get(FeedbackMessage, message_id, with_for_update=True)

    async def delete(self, message_id: int) -> None:
        """Удалить обращение."""

        await self.db.execute(delete(FeedbackMessage).where(FeedbackMessage.id == message_id))
        await self.db.commit()

    async def add(self, message: FeedbackMessage) -> FeedbackMessage:
        """Создать обращение."""

        self.db.add(message)
        return await self.save(message)

    async def save(self, message: FeedbackMessage) -> FeedbackMessage:
        """Сохранить обращение."""

        await self.db.commit()
        return message
