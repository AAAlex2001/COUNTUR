import asyncio

from app.users.exceptions import EmailAlreadyTakenError
from app.users.models import User
from app.users.passwords import hash_password
from app.users.repository import UserRepository
from app.users.schemas import UserRegisterSchema
from app.users.validators import normalize_email, validate_password


class RegisterUserUseCase:
    """Регистрация покупателя."""

    def __init__(self, users: UserRepository) -> None:
        """Подключить покупателей."""

        self.users = users

    async def execute(self, payload: UserRegisterSchema) -> User:
        """Создать аккаунт покупателя."""

        email = normalize_email(payload.email)
        validate_password(payload.password)

        if await self.users.get_by_email(email) is not None:
            raise EmailAlreadyTakenError(email)

        password_hash = await asyncio.to_thread(hash_password, payload.password)
        user = User(name=payload.name, email=email, password_hash=password_hash)

        return await self.users.save(user)
