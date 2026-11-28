"""Тесты входа администратора по данным из настроек."""

import asyncio
from datetime import UTC, datetime, timedelta

import jwt
import pytest

from app.auth.repository import AuthSessionRepository
from app.admin.exceptions import InvalidCredentialsError
from app.admin.schemas import AdminLoginSchema
from app.admin.usecases.login import LoginAdminUseCase
from app.config import Settings, get_settings
from app.tokens import TokenRole, create_token, read_token

PASSWORD = "strong-pass-123"


class FakeSession:
    def __init__(self, active_session_id: str | None) -> None:
        self.active_session_id = active_session_id

    async def scalar(self, query) -> str | None:
        return self.active_session_id


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

    claims = read_token(token.value, role)
    assert claims is not None
    assert claims.subject == "42"
    other_role = TokenRole.ADMIN if role == TokenRole.CUSTOMER else TokenRole.CUSTOMER
    assert read_token(token.value, other_role) is None
    assert read_token(token.value + "x", role) is None
    assert read_token("not-a-token", role) is None
    assert jwt.decode(
        token.value,
        get_settings().jwt_secret,
        algorithms=["HS256"],
    )["jti"] == token.session_id


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
    claims = {
        "sub": subject,
        "exp": datetime.now(UTC) + timedelta(minutes=5),
        "jti": "legacy-session",
    }
    token = jwt.encode(claims, settings.jwt_secret, algorithm="HS256")

    for requested in TokenRole:
        claims = read_token(token, requested)
        assert (claims.subject if claims else None) == (subject if requested == role else None)


def test_token_without_session_id_is_rejected() -> None:
    settings = get_settings()
    claims = {
        "sub": "admin",
        "exp": datetime.now(UTC) + timedelta(minutes=5),
    }
    token = jwt.encode(claims, settings.jwt_secret, algorithm="HS256")

    assert read_token(token, TokenRole.ADMIN) is None


@pytest.mark.parametrize("session_is_stored", [False, True])
def test_token_requires_a_stored_session(session_is_stored: bool) -> None:
    token = create_token("admin", TokenRole.ADMIN)
    claims = read_token(token.value, TokenRole.ADMIN)

    assert claims is not None
    active_session_id = token.session_id if session_is_stored else None
    active = asyncio.run(
        AuthSessionRepository(FakeSession(active_session_id)).is_active(claims)
    )

    assert active is session_is_stored
