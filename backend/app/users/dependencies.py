"""Покупатели: репозиторий, фабрики сценариев, cookie с токеном и защита ручек."""

from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.repository import AuthSessionRepository
from app.config import get_settings
from app.database import get_session
from app.tokens import TokenRole, read_token
from app.users.models import User
from app.users.repository import UserRepository
from app.users.usecases.change_password import ChangePasswordUseCase
from app.users.usecases.login import LoginUserUseCase
from app.users.usecases.register import RegisterUserUseCase
from app.users.usecases.update_profile import UpdateProfileUseCase

USER_COOKIE = "user_token"
SECONDS_IN_DAY = 60 * 60 * 24


def get_user_repository(
    session: AsyncSession = Depends(get_session),
) -> UserRepository:
    """Репозиторий покупателей с сессией текущего запроса."""

    return UserRepository(session)


def get_auth_session_repository(
    session: AsyncSession = Depends(get_session),
) -> AuthSessionRepository:
    """Репозиторий активных входов."""

    return AuthSessionRepository(session)


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


async def get_user_by_id(
    user_id: int,
    users: UserRepository = Depends(get_user_repository),
) -> User:
    """Покупатель по id из пути для админки. Отсутствующий — 404."""

    user = await users.get_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Покупатель не найден",
        )

    return user


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
    """Удалить cookie с токеном."""

    response.delete_cookie(USER_COOKIE, path="/")


async def require_user(
    request: Request,
    users: UserRepository = Depends(get_user_repository),
    sessions: AuthSessionRepository = Depends(get_auth_session_repository),
) -> User:
    """Покупатель по токену из cookie. Без валидного токена — 401."""

    token = request.cookies.get(USER_COOKIE)
    claims = read_token(token, TokenRole.CUSTOMER)

    if claims is None or not claims.subject.isdigit() or not await sessions.is_active(claims):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется вход",
        )

    user = await users.get_by_id(int(claims.subject))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется вход",
        )

    return user
