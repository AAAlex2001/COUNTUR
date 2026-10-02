"""Тесты сценариев администратора без БД."""

import asyncio

import pytest

from app.admin.models import Admin
from app.admin.schemas import AdminLoginSchema
from app.admin.services.exceptions import (
    AdminAlreadyExistsError,
    InvalidCredentialsError,
    WeakPasswordError,
)
from app.admin.services.tokens import create_access_token, read_admin_id
from app.admin.services.usecases.create_admin import CreateAdminUseCase
from app.admin.services.usecases.login import LoginAdminUseCase

PASSWORD = "strong-pass-123"


class FakeAdminRepository:
    """Администраторы в словаре по логину."""

    def __init__(self) -> None:
        self.items: dict[str, Admin] = {}

    async def get_by_login(self, login: str) -> Admin | None:
        return self.items.get(login)

    async def add(self, admin: Admin) -> Admin:
        admin.id = len(self.items) + 1
        admin.is_active = True
        self.items[admin.login] = admin

        return admin


def make_repository_with_admin() -> FakeAdminRepository:
    admins = FakeAdminRepository()
    asyncio.run(CreateAdminUseCase(admins).execute(" Admin ", PASSWORD))

    return admins


def test_create_normalizes_login_and_hashes_password() -> None:
    admins = make_repository_with_admin()

    admin = admins.items["admin"]

    assert admin.password_hash != PASSWORD
    assert admin.password_hash.startswith("$2")


def test_create_rejects_duplicate_login() -> None:
    admins = make_repository_with_admin()

    with pytest.raises(AdminAlreadyExistsError):
        asyncio.run(CreateAdminUseCase(admins).execute("ADMIN", PASSWORD))


@pytest.mark.parametrize("password", ["short1", "only-letters-here", "1234567890", "я1" * 40])
def test_create_rejects_weak_password(password: str) -> None:
    with pytest.raises(WeakPasswordError):
        asyncio.run(CreateAdminUseCase(FakeAdminRepository()).execute("admin", password))


def test_login_returns_admin_for_valid_credentials() -> None:
    admins = make_repository_with_admin()
    usecase = LoginAdminUseCase(admins)

    admin = asyncio.run(usecase.execute(AdminLoginSchema(login="ADMIN", password=PASSWORD)))

    assert admin.login == "admin"


def test_login_rejects_wrong_password_unknown_login_and_disabled_admin() -> None:
    admins = make_repository_with_admin()
    usecase = LoginAdminUseCase(admins)

    with pytest.raises(InvalidCredentialsError):
        asyncio.run(usecase.execute(AdminLoginSchema(login="admin", password="wrong-pass-123")))

    with pytest.raises(InvalidCredentialsError):
        asyncio.run(usecase.execute(AdminLoginSchema(login="nobody", password=PASSWORD)))

    with pytest.raises(InvalidCredentialsError):
        asyncio.run(usecase.execute(AdminLoginSchema(login="admin", password="x" * 100)))

    admins.items["admin"].is_active = False

    with pytest.raises(InvalidCredentialsError):
        asyncio.run(usecase.execute(AdminLoginSchema(login="admin", password=PASSWORD)))


def test_token_roundtrip_and_garbage() -> None:
    token = create_access_token(42)

    assert read_admin_id(token) == 42
    assert read_admin_id(token + "x") is None
    assert read_admin_id("not-a-token") is None
