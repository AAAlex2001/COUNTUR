import asyncio

from app.users.exceptions import InvalidCredentialsError
from app.users.models import User
from app.users.passwords import hash_password, verify_password
from app.users.repository import UserRepository
from app.users.schemas import PasswordChangeSchema
from app.users.validators import validate_password


class ChangePasswordUseCase:
    """Смена пароля."""

    def __init__(self, users: UserRepository) -> None:
        """Подключить покупателей."""

        self.users = users

    async def execute(self, user: User, payload: PasswordChangeSchema) -> User:
        """Изменить пароль покупателя."""

        validate_password(payload.new_password)

        matches = await asyncio.to_thread(
            verify_password, payload.current_password, user.password_hash
        )
        if not matches:
            raise InvalidCredentialsError("Неверный текущий пароль")

        password_hash = await asyncio.to_thread(hash_password, payload.new_password)
        if not await self.users.replace_password(user, password_hash):
            raise InvalidCredentialsError("Неверный текущий пароль")

        return user
