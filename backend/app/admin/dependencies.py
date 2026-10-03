"""Администратор: фабрика сценария входа, cookie с токеном, защита админских ручек."""

from fastapi import HTTPException, Request, Response, status

from app.admin.services.usecases.login import LoginAdminUseCase
from app.admin.services.validators import normalize_login
from app.config import get_settings
from app.tokens import read_subject

ADMIN_COOKIE = "admin_token"
SECONDS_IN_DAY = 60 * 60 * 24


def get_login_usecase() -> LoginAdminUseCase:
    """Сценарий входа."""

    return LoginAdminUseCase(get_settings())


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
    """Удалить cookie с токеном — это и есть выход из панели."""

    response.delete_cookie(ADMIN_COOKIE, path="/")


def require_admin(request: Request) -> str:
    """Логин администратора по токену из cookie. Без валидного токена — 401."""

    token = request.cookies.get(ADMIN_COOKIE)
    login = read_subject(token) if token else None

    if login != normalize_login(get_settings().admin_login):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется вход",
        )

    return login
