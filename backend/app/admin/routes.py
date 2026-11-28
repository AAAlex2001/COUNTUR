from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.admin.dependencies import (
    ADMIN_COOKIE,
    clear_admin_cookie,
    get_auth_session_repository,
    get_login_usecase,
    require_admin,
    set_admin_cookie,
)
from app.admin.exceptions import InvalidCredentialsError
from app.admin.schemas import AdminLoginSchema, AdminOutSchema
from app.admin.usecases.login import LoginAdminUseCase
from app.auth.repository import AuthSessionRepository
from app.tokens import TokenRole, create_token

router = APIRouter(prefix="/admin/auth", tags=["admin: auth"])


@router.post("/login")
async def login(
    payload: AdminLoginSchema,
    response: Response,
    usecase: LoginAdminUseCase = Depends(get_login_usecase),
    sessions: AuthSessionRepository = Depends(get_auth_session_repository),
) -> AdminOutSchema:
    """Вход в административную панель. Выдаёт cookie с токеном."""

    try:
        admin_login = usecase.execute(payload)
    except InvalidCredentialsError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
        ) from error

    token = create_token(admin_login, TokenRole.ADMIN)
    await sessions.create(token)
    set_admin_cookie(response, token.value)

    return AdminOutSchema(login=admin_login)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: Request,
    response: Response,
    sessions: AuthSessionRepository = Depends(get_auth_session_repository),
) -> None:
    """Отозвать сессию и удалить cookie."""

    await sessions.revoke_token(request.cookies.get(ADMIN_COOKIE), TokenRole.ADMIN)
    clear_admin_cookie(response)


@router.get("/me")
async def me(admin_login: str = Depends(require_admin)) -> AdminOutSchema:
    """Текущий администратор по cookie. Панель вызывает при открытии страницы."""

    return AdminOutSchema(login=admin_login)
