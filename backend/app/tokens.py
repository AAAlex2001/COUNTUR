"""JWT-токены для cookie входа: администратора и покупателя."""

from datetime import UTC, datetime, timedelta
from enum import StrEnum

import jwt

from app.config import get_settings

ALGORITHM = "HS256"


class TokenRole(StrEnum):
    """Назначение токена."""

    ADMIN = "admin"
    CUSTOMER = "customer"


def create_token(subject: str, role: TokenRole) -> str:
    """Выпустить токен входа."""

    settings = get_settings()
    expires_at = datetime.now(UTC) + timedelta(days=settings.jwt_expires_days)
    payload = {"sub": subject, "exp": expires_at, "role": role}

    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def legacy_role(subject: str, admin_login: str) -> TokenRole | None:
    """Распознать прежнюю сессию."""

    if subject == admin_login.strip().lower():
        # В старых cookie числовой логин неотличим от ID покупателя.
        return None if subject.isdigit() else TokenRole.ADMIN
    if subject.isascii() and subject.isdecimal():
        return TokenRole.CUSTOMER
    return None


def read_subject(token: str | None, role: TokenRole) -> str | None:
    """Проверить сессию для роли."""

    if not token:
        return None

    settings = get_settings()

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[ALGORITHM],
            options={"require": ["exp", "sub"]},
        )
    except jwt.InvalidTokenError:
        return None

    subject = payload["sub"]
    if not isinstance(subject, str):
        return None
    token_role = payload.get("role")
    if "role" not in payload:
        token_role = legacy_role(subject, settings.admin_login)
    return subject if token_role == role else None
