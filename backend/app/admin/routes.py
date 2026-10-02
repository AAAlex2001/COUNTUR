from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.admin.dependencies import (
    clear_admin_cookie,
    get_login_usecase,
    require_admin,
    set_admin_cookie,
)
from app.admin.models import Admin
from app.admin.schemas import AdminLoginSchema, AdminOutSchema
from app.admin.services.exceptions import InvalidCredentialsError
from app.admin.services.tokens import create_access_token
from app.admin.services.usecases.login import LoginAdminUseCase

router = APIRouter(prefix="/admin/auth", tags=["admin: auth"])


@router.post("/login")
async def login(
    payload: AdminLoginSchema,
    response: Response,
    usecase: LoginAdminUseCase = Depends(get_login_usecase),
) -> AdminOutSchema:
    """Вход в административную панель. Выдаёт cookie с токеном."""

    try:
        admin = await usecase.execute(payload)
    except InvalidCredentialsError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
        ) from error

    token = create_access_token(admin.id)
    set_admin_cookie(response, token)

    return AdminOutSchema.model_validate(admin)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> None:
    """Выход: удаляем cookie с токеном."""

    clear_admin_cookie(response)


@router.get("/me")
async def me(admin: Admin = Depends(require_admin)) -> AdminOutSchema:
    """Текущий администратор по cookie. Панель вызывает при открытии страницы."""

    return AdminOutSchema.model_validate(admin)
