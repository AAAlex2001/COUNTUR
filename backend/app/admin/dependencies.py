"""Администратор: фабрика сценария входа, cookie с токеном, защита админских ручек."""

from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.repository import AuthSessionRepository
from app.admin.usecases.login import LoginAdminUseCase
from app.admin.validators import normalize_login
from app.config import get_settings
from app.database import get_session
from app.tokens import TokenRole, read_token

ADMIN_COOKIE = "admin_token"
SECONDS_IN_DAY = 60 * 60 * 24


def get_login_usecase() -> LoginAdminUseCase:
    """Сценарий входа."""

    return LoginAdminUseCase(get_settings())


def get_auth_session_repository(
    session: AsyncSession = Depends(get_session),
) -> AuthSessionRepository:
    """Репозиторий активных входов."""

    return AuthSessionRepository(session)


def set_admin_cookie(response: Response, token: str) -> None:
    """Положить токен в httponly-cookie: JavaScript её не видит, браузер шлёт сам."""

    settings = get_settings()

    response.set_cookie(
        ADMIN_COOKIE,
        token,
        max_age=settings.jwt_expires_days * SECONDS_IN_DAY,
        httponly=True,
        samesite="strict",
        secure=settings.cookie_secure,
        path="/",
    )


def clear_admin_cookie(response: Response) -> None:
    """Удалить cookie с токеном."""

    response.delete_cookie(ADMIN_COOKIE, path="/")


async def require_admin(
    request: Request,
    sessions: AuthSessionRepository = Depends(get_auth_session_repository),
) -> str:
    """Логин администратора по токену из cookie. Без валидного токена — 401."""

    token = request.cookies.get(ADMIN_COOKIE)
    claims = read_token(token, TokenRole.ADMIN)
    active = claims is not None and await sessions.is_active(claims)
    login = claims.subject if active else None

    if login != normalize_login(get_settings().admin_login):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется вход",
        )

    return login
