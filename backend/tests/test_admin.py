"""Тесты входа администратора по данным из настроек."""

from datetime import UTC, datetime, timedelta

import jwt
import pytest

from app.admin.exceptions import InvalidCredentialsError
from app.admin.schemas import AdminLoginSchema
from app.admin.usecases.login import LoginAdminUseCase
from app.config import Settings, get_settings
from app.tokens import TokenRole, create_token, read_subject

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


@pytest.mark.parametrize("role", list(TokenRole))
def test_token_is_valid_only_for_its_role(role: TokenRole) -> None:
    token = create_token("42", role)

    assert read_subject(token, role) == "42"
    other_role = TokenRole.ADMIN if role == TokenRole.CUSTOMER else TokenRole.CUSTOMER
    assert read_subject(token, other_role) is None
    assert read_subject(token + "x", role) is None
    assert read_subject("not-a-token", role) is None


@pytest.mark.parametrize(
    ("login", "subject", "role"),
    [
        (" Admin ", "admin", TokenRole.ADMIN),
        ("admin", "42", TokenRole.CUSTOMER),
        ("42", "42", None),
    ],
)
def test_existing_session_keeps_only_an_unambiguous_role(monkeypatch, login, subject, role) -> None:
    settings = get_settings()
    monkeypatch.setattr(settings, "admin_login", login)
    claims = {"sub": subject, "exp": datetime.now(UTC) + timedelta(minutes=5)}
    token = jwt.encode(claims, settings.jwt_secret, algorithm="HS256")

    for requested in TokenRole:
        assert read_subject(token, requested) == (subject if requested == role else None)
