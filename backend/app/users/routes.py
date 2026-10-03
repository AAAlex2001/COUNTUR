from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.tokens import create_token
from app.users.dependencies import (
    clear_user_cookie,
    get_change_password_usecase,
    get_login_usecase,
    get_register_usecase,
    get_update_profile_usecase,
    require_user,
    set_user_cookie,
)
from app.users.models import User
from app.users.schemas import (
    PasswordChangeSchema,
    UserLoginSchema,
    UserRegisterSchema,
    UserSchema,
    UserUpdateSchema,
)
from app.users.services.exceptions import (
    EmailAlreadyTakenError,
    InvalidCredentialsError,
    WeakPasswordError,
)
from app.users.services.usecases.change_password import ChangePasswordUseCase
from app.users.services.usecases.login import LoginUserUseCase
from app.users.services.usecases.register import RegisterUserUseCase
from app.users.services.usecases.update_profile import UpdateProfileUseCase

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


@router.patch("/me")
async def update_me(
    payload: UserUpdateSchema,
    user: User = Depends(require_user),
    usecase: UpdateProfileUseCase = Depends(get_update_profile_usecase),
) -> UserSchema:
    """Изменение профиля: имя, контакты, адрес, уведомления."""

    try:
        updated = await usecase.execute(user, payload)
    except EmailAlreadyTakenError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="На этот email уже есть аккаунт",
        ) from error

    return UserSchema.model_validate(updated)


@router.post("/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    payload: PasswordChangeSchema,
    user: User = Depends(require_user),
    usecase: ChangePasswordUseCase = Depends(get_change_password_usecase),
) -> None:
    """Смена пароля по текущему паролю."""

    try:
        await usecase.execute(user, payload)
    except WeakPasswordError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error
    except InvalidCredentialsError as error:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Неверный текущий пароль",
        ) from error
