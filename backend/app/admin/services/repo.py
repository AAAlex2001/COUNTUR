"""Репозиторий администраторов: только запросы к таблице admins."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.admin.models import Admin


class AdminRepository:
    """Доступ к таблице admins. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, admin_id: int) -> Admin | None:
        """Администратор по id или None."""

        return await self.db.get(Admin, admin_id)

    async def get_by_login(self, login: str) -> Admin | None:
        """Администратор по логину или None."""

        stmt = select(Admin).where(Admin.login == login)
        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def add(self, admin: Admin) -> Admin:
        """Сохранить нового администратора."""

        self.db.add(admin)
        await self.db.commit()
        await self.db.refresh(admin)

        return admin
