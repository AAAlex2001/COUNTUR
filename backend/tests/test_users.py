"""Тесты регистрации и входа покупателя без БД."""

import asyncio

import pytest

from app.users.models import User
from app.users.schemas import UserLoginSchema, UserRegisterSchema
from app.users.services.exceptions import (
    EmailAlreadyTakenError,
    InvalidCredentialsError,
    WeakPasswordError,
)
from app.users.services.usecases.login import LoginUserUseCase
from app.users.services.usecases.register import RegisterUserUseCase

PASSWORD = "strong-pass-123"


class FakeUserRepository:
    """Покупатели в словаре по email."""

    def __init__(self) -> None:
        self.items: dict[str, User] = {}

    async def get_by_email(self, email: str) -> User | None:
        return self.items.get(email)

    async def add(self, user: User) -> User:
        user.id = len(self.items) + 1
        self.items[user.email] = user

        return user


def register(users: FakeUserRepository, email: str = " Alex@Mail.ru ", password: str = PASSWORD):
    payload = UserRegisterSchema(name=" Алексей ", email=email, password=password)

    return asyncio.run(RegisterUserUseCase(users).execute(payload))


def test_register_normalizes_fields_and_hashes_password() -> None:
    users = FakeUserRepository()

    user = register(users)

    assert (user.name, user.email) == ("Алексей", "alex@mail.ru")
    assert user.password_hash != PASSWORD
    assert user.password_hash.startswith("$2")


def test_register_rejects_taken_email() -> None:
    users = FakeUserRepository()
    register(users)

    with pytest.raises(EmailAlreadyTakenError):
        register(users, email="ALEX@mail.ru")


@pytest.mark.parametrize("password", ["onlyletters", "1234567890", "я1" * 40])
def test_register_rejects_weak_password(password: str) -> None:
    with pytest.raises(WeakPasswordError):
        register(FakeUserRepository(), password=password)


def test_login_returns_user_for_valid_credentials() -> None:
    users = FakeUserRepository()
    register(users)

    user = asyncio.run(
        LoginUserUseCase(users).execute(UserLoginSchema(email="ALEX@mail.ru", password=PASSWORD))
    )

    assert user.email == "alex@mail.ru"


@pytest.mark.parametrize(
    ("email", "password"),
    [("alex@mail.ru", "wrong-pass-123"), ("nobody@mail.ru", PASSWORD)],
)
def test_login_rejects_wrong_email_or_password(email: str, password: str) -> None:
    users = FakeUserRepository()
    register(users)

    with pytest.raises(InvalidCredentialsError):
        asyncio.run(LoginUserUseCase(users).execute(UserLoginSchema(email=email, password=password)))
