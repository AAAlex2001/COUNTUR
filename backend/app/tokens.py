"""JWT-токены для cookie входа: администратора и покупателя."""

from datetime import datetime, timedelta, timezone

import jwt

from app.config import get_settings

ALGORITHM = "HS256"


def create_token(subject: str) -> str:
    """Выпустить токен с subject и сроком из настроек."""

    settings = get_settings()
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.jwt_expires_days)
    payload = {"sub": subject, "exp": expires_at}

    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def read_subject(token: str) -> str | None:
    """Достать subject из токена. None — если токен испорчен или истёк."""

    settings = get_settings()

    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
    except jwt.InvalidTokenError:
        return None

    return payload.get("sub")
