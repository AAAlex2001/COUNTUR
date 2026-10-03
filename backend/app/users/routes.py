from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.tokens import create_token
from app.users.dependencies import (
    clear_user_cookie,
    get_login_usecase,
    get_register_usecase,
    require_user,
    set_user_cookie,
)
from app.users.models import User
from app.users.schemas import UserLoginSchema, UserRegisterSchema, UserSchema
from app.users.services.exceptions import (
    EmailAlreadyTakenError,
    InvalidCredentialsError,
    WeakPasswordError,
)
from app.users.services.usecases.login import LoginUserUseCase
from app.users.services.usecases.register import RegisterUserUseCase

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    payload: UserRegisterSchema,
    response: Response,
    usecase: RegisterUserUseCase = Depends(get_register_usecase),
) -> UserSchema:
    """Регистрация. Сразу выдаёт cookie со входом."""

    try:
        user = await usecase.execute(payload)
    except WeakPasswordError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error
    except EmailAlreadyTakenError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="На этот email уже есть аккаунт",
        ) from error

    set_user_cookie(response, create_token(str(user.id)))

    return UserSchema.model_validate(user)


@router.post("/login")
async def login(
    payload: UserLoginSchema,
    response: Response,
    usecase: LoginUserUseCase = Depends(get_login_usecase),
) -> UserSchema:
    """Вход по email и паролю. Выдаёт cookie с токеном."""

    try:
        user = await usecase.execute(payload)
    except InvalidCredentialsError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
        ) from error

    set_user_cookie(response, create_token(str(user.id)))

    return UserSchema.model_validate(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> None:
    """Выход: удаляем cookie с токеном."""

    clear_user_cookie(response)


@router.get("/me")
async def me(user: User = Depends(require_user)) -> UserSchema:
    """Текущий покупатель по cookie. Сайт вызывает при открытии страницы."""

    return UserSchema.model_validate(user)
