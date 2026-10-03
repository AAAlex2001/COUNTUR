"""Сценарий смены пароля покупателя."""

import asyncio

from app.users.models import User
from app.users.schemas import PasswordChangeSchema
from app.users.services.exceptions import InvalidCredentialsError
from app.users.services.passwords import hash_password, verify_password
from app.users.services.repo import UserRepository
from app.users.services.validators import validate_password


class ChangePasswordUseCase:
    """Сверить текущий пароль и записать хеш нового."""

    def __init__(self, users: UserRepository) -> None:
        self.users = users

    async def execute(self, user: User, payload: PasswordChangeSchema) -> User:
        """Вернуть покупателя с новым паролем. Неверный текущий — InvalidCredentialsError."""

        validate_password(payload.new_password)

        matches = await asyncio.to_thread(
            verify_password, payload.current_password, user.password_hash
        )
        if not matches:
            raise InvalidCredentialsError("Неверный текущий пароль")

        user.password_hash = await asyncio.to_thread(hash_password, payload.new_password)

        return await self.users.save(user)
