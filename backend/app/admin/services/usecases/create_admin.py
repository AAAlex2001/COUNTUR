"""Сценарий создания учётной записи администратора."""

import asyncio

from app.admin.models import Admin
from app.admin.services.exceptions import AdminAlreadyExistsError
from app.admin.services.passwords import hash_password
from app.admin.services.repo import AdminRepository
from app.admin.services.validators import normalize_login, validate_password


class CreateAdminUseCase:
    """Создать администратора. Вызывается командой на сервере, а не через сайт."""

    def __init__(self, admins: AdminRepository) -> None:
        self.admins = admins

    async def execute(self, login: str, password: str) -> Admin:
        """Вернуть созданного администратора. Бросает ошибки пароля и занятого логина."""

        login = normalize_login(login)
        validate_password(password)

        existing = await self.admins.get_by_login(login)
        if existing is not None:
            raise AdminAlreadyExistsError(login)

        password_hash = await asyncio.to_thread(hash_password, password)

        return await self.admins.add(Admin(login=login, password_hash=password_hash))
