"""Тесты входа администратора по данным из настроек."""

import pytest

from app.admin.schemas import AdminLoginSchema
from app.admin.services.exceptions import InvalidCredentialsError
from app.admin.services.usecases.login import LoginAdminUseCase
from app.config import Settings
from app.tokens import create_token, read_subject

PASSWORD = "strong-pass-123"


def make_usecase() -> LoginAdminUseCase:
    settings = Settings(
        database_url="postgresql+asyncpg://test:test@localhost:5432/test",
        jwt_secret="test-jwt-secret-not-for-production-123456",
        admin_login=" Admin ",
        admin_password=PASSWORD,
    )

    return LoginAdminUseCase(settings)


def test_login_returns_normalized_login_for_valid_credentials() -> None:
    login = make_usecase().execute(AdminLoginSchema(login="ADMIN ", password=PASSWORD))

    assert login == "admin"


@pytest.mark.parametrize(
    ("login", "password"),
    [("admin", "wrong-pass-123"), ("nobody", PASSWORD), ("admin", PASSWORD.upper())],
)
def test_login_rejects_wrong_login_or_password(login: str, password: str) -> None:
    with pytest.raises(InvalidCredentialsError):
        make_usecase().execute(AdminLoginSchema(login=login, password=password))


def test_token_roundtrip_and_garbage() -> None:
    token = create_token("admin")

    assert read_subject(token) == "admin"
    assert read_subject(token + "x") is None
    assert read_subject("not-a-token") is None
