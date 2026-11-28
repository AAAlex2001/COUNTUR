"""JWT-токены для cookie входа: администратора и покупателя."""

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from enum import StrEnum
from uuid import uuid4

import jwt

from app.config import get_settings

ALGORITHM = "HS256"


class TokenRole(StrEnum):
    """Назначение токена."""

    ADMIN = "admin"
    CUSTOMER = "customer"


@dataclass(frozen=True)
class AuthToken:
    """Токен и данные, которые нужны для его хранения в БД."""

    value: str
    session_id: str
    subject: str
    role: TokenRole
    expires_at: datetime


@dataclass(frozen=True)
class TokenClaims:
    """Проверенные данные из JWT."""

    session_id: str
    subject: str
    role: TokenRole


def create_token(subject: str, role: TokenRole) -> AuthToken:
    """Выпустить токен входа."""

    settings = get_settings()
    expires_at = datetime.now(UTC) + timedelta(days=settings.jwt_expires_days)
    session_id = str(uuid4())
    payload = {
        "sub": subject,
        "exp": expires_at,
        "jti": session_id,
        "role": role.value,
    }

    return AuthToken(
        value=jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM),
        session_id=session_id,
        subject=subject,
        role=role,
        expires_at=expires_at,
    )


def legacy_role(subject: str, admin_login: str) -> TokenRole | None:
    """Распознать прежнюю сессию."""

    if subject == admin_login.strip().lower():
        # В старых cookie числовой логин неотличим от ID покупателя.
        return None if subject.isdigit() else TokenRole.ADMIN
    if subject.isascii() and subject.isdecimal():
        return TokenRole.CUSTOMER
    return None


def read_token(token: str | None, role: TokenRole) -> TokenClaims | None:
    """Проверить подпись, срок действия и назначение токена."""

    if not token:
        return None

    settings = get_settings()

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[ALGORITHM],
            options={"require": ["exp", "sub", "jti"]},
        )
    except jwt.InvalidTokenError:
        return None

    subject = payload["sub"]
    session_id = payload["jti"]
    if not isinstance(subject, str) or not isinstance(session_id, str):
        return None

    token_role = payload.get("role")
    if "role" not in payload:
        token_role = legacy_role(subject, settings.admin_login)
    if token_role != role:
        return None

    return TokenClaims(session_id=session_id, subject=subject, role=role)
