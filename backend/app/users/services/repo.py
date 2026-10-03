"""Репозиторий покупателей: только запросы к таблице users."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.users.models import User


class UserRepository:
    """Доступ к таблице users. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, user_id: int) -> User | None:
        """Покупатель по id или None."""

        return await self.db.get(User, user_id)

    async def get_by_email(self, email: str) -> User | None:
        """Покупатель по email или None."""

        result = await self.db.execute(select(User).where(User.email == email))

        return result.scalar_one_or_none()

    async def add(self, user: User) -> User:
        """Сохранить нового покупателя."""

        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)

        return user

    async def save(self, user: User) -> User:
        """Сохранить изменения покупателя."""

        await self.db.commit()
        await self.db.refresh(user)

        return user
