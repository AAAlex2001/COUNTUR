from datetime import datetime
from types import NoneType
from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, StringConstraints, field_validator
from pydantic.json_schema import SkipJsonSchema

UserName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]


class UserRegisterSchema(BaseModel):
    """Данные для регистрации."""

    name: UserName = Field(description="Как обращаться")
    email: EmailStr = Field(..., max_length=254, description="Email, он же логин")
    password: str = Field(..., min_length=8, max_length=128, description="Пароль")


class UserLoginSchema(BaseModel):
    """Данные для входа."""

    email: EmailStr = Field(..., max_length=254, description="Email")
    password: str = Field(..., min_length=1, max_length=128, description="Пароль")


class UserUpdateSchema(BaseModel):
    """Изменение профиля. Передаются только поля, которые меняются."""

    model_config = ConfigDict(str_strip_whitespace=True)

    name: UserName | SkipJsonSchema[None] = Field(default_factory=NoneType)
    last_name: str | None = Field(None, max_length=100)
    email: EmailStr | SkipJsonSchema[None] = Field(default_factory=NoneType, max_length=254)
    phone: str | None = Field(None, max_length=32)
    address: str | None = Field(None, max_length=500)
    notify_orders: bool | SkipJsonSchema[None] = Field(default_factory=NoneType)
    notify_promo: bool | SkipJsonSchema[None] = Field(default_factory=NoneType)

    @field_validator("name", "email", "notify_orders", "notify_promo", mode="before")
    @classmethod
    def require_value(cls, value: object) -> object:
        """Проверить обязательное поле профиля."""

        if value is None:
            raise ValueError("Это поле нельзя очистить")
        return value


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


class UserAdminListSchema(BaseModel):
    """Страница списка покупателей в админке."""

    users: list[UserSchema]
    total: int = Field(..., description="Сколько покупателей подходит под поиск")
