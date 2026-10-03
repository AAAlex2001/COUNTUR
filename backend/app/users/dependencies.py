"""Покупатели: репозиторий, фабрики сценариев, cookie с токеном и защита ручек."""

from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_session
from app.tokens import read_subject
from app.users.models import User
from app.users.services.repo import UserRepository
from app.users.services.usecases.change_password import ChangePasswordUseCase
from app.users.services.usecases.login import LoginUserUseCase
from app.users.services.usecases.register import RegisterUserUseCase
from app.users.services.usecases.update_profile import UpdateProfileUseCase

USER_COOKIE = "user_token"
SECONDS_IN_DAY = 60 * 60 * 24


def get_user_repository(
    session: AsyncSession = Depends(get_session),
) -> UserRepository:
    """Репозиторий покупателей с сессией текущего запроса."""

    return UserRepository(session)


def get_register_usecase(
    users: UserRepository = Depends(get_user_repository),
) -> RegisterUserUseCase:
    """Сценарий регистрации."""

    return RegisterUserUseCase(users)


def get_login_usecase(
    users: UserRepository = Depends(get_user_repository),
) -> LoginUserUseCase:
    """Сценарий входа."""

    return LoginUserUseCase(users)


def get_update_profile_usecase(
    users: UserRepository = Depends(get_user_repository),
) -> UpdateProfileUseCase:
    """Сценарий изменения профиля."""

    return UpdateProfileUseCase(users)


def get_change_password_usecase(
    users: UserRepository = Depends(get_user_repository),
) -> ChangePasswordUseCase:
    """Сценарий смены пароля."""

    return ChangePasswordUseCase(users)


def set_user_cookie(response: Response, token: str) -> None:
    """Положить токен в httponly-cookie: JavaScript её не видит, браузер шлёт сам."""

    settings = get_settings()

    response.set_cookie(
        USER_COOKIE,
        token,
        max_age=settings.jwt_expires_days * SECONDS_IN_DAY,
        httponly=True,
        samesite="lax",
        secure=settings.cookie_secure,
        path="/",
    )


def clear_user_cookie(response: Response) -> None:
    """Удалить cookie с токеном — это и есть выход из аккаунта."""

    response.delete_cookie(USER_COOKIE, path="/")


async def require_user(
    request: Request,
    users: UserRepository = Depends(get_user_repository),
) -> User:
    """Покупатель по токену из cookie. Без валидного токена — 401."""

    token = request.cookies.get(USER_COOKIE)
    subject = read_subject(token) if token else None
    user = await users.get_by_id(int(subject)) if subject and subject.isdigit() else None

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется вход",
        )

    return user
