"""Репозиторий обращений: только запросы к таблице feedback_messages."""

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.feedback.models import FeedbackMessage


class FeedbackRepository:
    """Доступ к таблице feedback_messages. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_all(
        self, status: str | None, limit: int, offset: int
    ) -> tuple[list[FeedbackMessage], int]:
        """Обращения для админки, свежие первыми, и их общее количество."""

        conditions = [FeedbackMessage.status == status] if status else []

        messages_stmt = (
            select(FeedbackMessage)
            .where(*conditions)
            .order_by(FeedbackMessage.created_at.desc(), FeedbackMessage.id.desc())
            .limit(limit)
            .offset(offset)
        )
        count_stmt = select(func.count()).select_from(FeedbackMessage).where(*conditions)

        result = await self.db.execute(messages_stmt)
        messages = list(result.scalars().all())

        total = await self.db.scalar(count_stmt)
        if total is None:
            total = 0

        return messages, total

    async def get_by_id(
        self, message_id: int, for_update: bool = False
    ) -> FeedbackMessage | None:
        """Обращение по номеру или None."""

        return await self.db.get(FeedbackMessage, message_id, with_for_update=for_update)

    async def delete(self, message_id: int) -> None:
        """Удалить обращение и сохранённый ответ."""

        statement = delete(FeedbackMessage).where(FeedbackMessage.id == message_id)
        await self.db.execute(statement)
        await self.db.commit()

    async def add(self, message: FeedbackMessage) -> FeedbackMessage:
        """Сохранить новое обращение."""

        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)

        return message

    async def save(self, message: FeedbackMessage) -> FeedbackMessage:
        """Сохранить изменения обращения."""

        await self.db.commit()
        await self.db.refresh(message)

        return message
