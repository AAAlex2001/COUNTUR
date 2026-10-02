"""Администраторы: фабрики сценариев, cookie с токеном, защита админских ручек."""

from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.admin.models import Admin
from app.admin.services.repo import AdminRepository
from app.admin.services.tokens import read_admin_id
from app.admin.services.usecases.login import LoginAdminUseCase
from app.config import get_settings
from app.database import get_session

ADMIN_COOKIE = "admin_token"
SECONDS_IN_DAY = 60 * 60 * 24


def get_admin_repository(
    session: AsyncSession = Depends(get_session),
) -> AdminRepository:
    """Репозиторий администраторов с сессией текущего запроса."""

    return AdminRepository(session)


def get_login_usecase(
    admins: AdminRepository = Depends(get_admin_repository),
) -> LoginAdminUseCase:
    """Сценарий входа."""

    return LoginAdminUseCase(admins)


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


async def require_admin(
    request: Request,
    admins: AdminRepository = Depends(get_admin_repository),
) -> Admin:
    """Администратор по токену из cookie. Без валидного токена — 401."""

    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Требуется вход",
    )

    token = request.cookies.get(ADMIN_COOKIE)
    if token is None:
        raise unauthorized

    admin_id = read_admin_id(token)
    if admin_id is None:
        raise unauthorized

    admin = await admins.get_by_id(admin_id)
    if admin is None or not admin.is_active:
        raise unauthorized

    return admin
