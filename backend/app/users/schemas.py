from datetime import datetime

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


class UserUpdateSchema(BaseModel):
    """Изменение профиля. Передаются только поля, которые меняются."""

    name: str | None = Field(None, min_length=1, max_length=100)
    last_name: str | None = Field(None, max_length=100)
    email: EmailStr | None = Field(None, max_length=254)
    phone: str | None = Field(None, max_length=32)
    address: str | None = Field(None, max_length=500)
    notify_orders: bool | None = None
    notify_promo: bool | None = None


class PasswordChangeSchema(BaseModel):
    """Смена пароля: текущий для проверки и новый."""

    current_password: str = Field(..., min_length=1, max_length=128)
    new_password: str = Field(..., min_length=8, max_length=128)


class UserSchema(BaseModel):
    """Покупатель, под которым выполнен вход."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID покупателя")
    name: str = Field(..., description="Имя")
    last_name: str | None = Field(None, description="Фамилия")
    email: str = Field(..., description="Email")
    phone: str | None = Field(None, description="Телефон")
    address: str | None = Field(None, description="Адрес доставки")
    notify_orders: bool = Field(..., description="Присылать уведомления о заказах")
    notify_promo: bool = Field(..., description="Присылать акции и новинки")
    created_at: datetime = Field(..., description="Когда зарегистрирован")
