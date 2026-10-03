"""Репозиторий покупателей: только запросы к таблице users."""

from sqlalchemy import func, or_, select
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

    async def list_all(
        self, search: str | None, limit: int, offset: int
    ) -> tuple[list[User], int]:
        """Покупатели для админки, новые первыми, с поиском по имени и email."""

        conditions = []
        if search:
            conditions.append(
                or_(
                    User.name.icontains(search, autoescape=True),
                    User.last_name.icontains(search, autoescape=True),
                    User.email.icontains(search, autoescape=True),
                )
            )

        users_stmt = (
            select(User)
            .where(*conditions)
            .order_by(User.created_at.desc(), User.id.desc())
            .limit(limit)
            .offset(offset)
        )
        count_stmt = select(func.count()).select_from(User).where(*conditions)

        result = await self.db.execute(users_stmt)
        users = list(result.scalars().all())

        total = await self.db.scalar(count_stmt)
        if total is None:
            total = 0

        return users, total

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
