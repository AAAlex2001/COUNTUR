"""Сценарий входа покупателя по email и паролю."""

import asyncio

from app.users.models import User
from app.users.schemas import UserLoginSchema
from app.users.services.exceptions import InvalidCredentialsError
from app.users.services.passwords import verify_password
from app.users.services.repo import UserRepository
from app.users.services.validators import normalize_email


class LoginUserUseCase:
    """Найти покупателя по email и сверить пароль с хешем."""

    def __init__(self, users: UserRepository) -> None:
        self.users = users

    async def execute(self, payload: UserLoginSchema) -> User:
        """Вернуть покупателя, если email и пароль верны. Иначе InvalidCredentialsError."""

        user = await self.users.get_by_email(normalize_email(payload.email))
        if user is None:
            raise InvalidCredentialsError("Неверный email или пароль")

        password_matches = await asyncio.to_thread(
            verify_password, payload.password, user.password_hash
        )
        if not password_matches:
            raise InvalidCredentialsError("Неверный email или пароль")

        return user
