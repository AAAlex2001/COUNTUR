from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRegisterSchema(BaseModel):
    """Данные для регистрации."""

    name: str = Field(..., min_length=1, max_length=100, description="Как обращаться")
    email: EmailStr = Field(..., max_length=254, description="Email, он же логин")
    password: str = Field(..., min_length=8, max_length=128, description="Пароль")


class UserLoginSchema(BaseModel):
    """Данные для входа."""

    email: EmailStr = Field(..., max_length=254, description="Email")
    password: str = Field(..., min_length=1, max_length=128, description="Пароль")


class UserSchema(BaseModel):
    """Покупатель, под которым выполнен вход."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID покупателя")
    name: str = Field(..., description="Имя")
    email: str = Field(..., description="Email")
