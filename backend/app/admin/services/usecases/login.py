"""Сценарий входа администратора по логину и паролю."""

import asyncio

from app.admin.models import Admin
from app.admin.schemas import AdminLoginSchema
from app.admin.services.exceptions import InvalidCredentialsError
from app.admin.services.passwords import verify_password
from app.admin.services.repo import AdminRepository
from app.admin.services.validators import normalize_login


class LoginAdminUseCase:
    """Найти администратора по логину и сверить пароль с хешем."""

    def __init__(self, admins: AdminRepository) -> None:
        self.admins = admins

    async def execute(self, payload: AdminLoginSchema) -> Admin:
        """Вернуть администратора, если логин и пароль верны. Иначе InvalidCredentialsError."""

        login = normalize_login(payload.login)

        admin = await self.admins.get_by_login(login)
        if admin is None or not admin.is_active:
            raise InvalidCredentialsError("Неверный логин или пароль")

        password_matches = await asyncio.to_thread(
            verify_password, payload.password, admin.password_hash
        )
        if not password_matches:
            raise InvalidCredentialsError("Неверный логин или пароль")

        return admin
