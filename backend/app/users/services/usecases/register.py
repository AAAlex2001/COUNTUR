"""Сценарий регистрации покупателя."""

import asyncio

from sqlalchemy.exc import IntegrityError

from app.users.models import User
from app.users.schemas import UserRegisterSchema
from app.users.services.exceptions import EmailAlreadyTakenError
from app.users.services.passwords import hash_password
from app.users.services.repo import UserRepository
from app.users.services.validators import normalize_email, validate_password


class RegisterUserUseCase:
    """Создать аккаунт покупателя."""

    def __init__(self, users: UserRepository) -> None:
        self.users = users

    async def execute(self, payload: UserRegisterSchema) -> User:
        """Вернуть созданного покупателя. Бросает ошибки слабого пароля и занятого email."""

        email = normalize_email(payload.email)
        validate_password(payload.password)

        if await self.users.get_by_email(email) is not None:
            raise EmailAlreadyTakenError(email)

        password_hash = await asyncio.to_thread(hash_password, payload.password)
        user = User(name=payload.name.strip(), email=email, password_hash=password_hash)

        try:
            return await self.users.add(user)
        except IntegrityError as error:
            raise EmailAlreadyTakenError(email) from error
