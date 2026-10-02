from pydantic import BaseModel, Field


class AdminLoginSchema(BaseModel):
    """Данные для входа в административную панель."""

    login: str = Field(..., min_length=1, max_length=64, description="Логин")
    password: str = Field(..., min_length=1, max_length=128, description="Пароль")


class AdminOutSchema(BaseModel):
    """Администратор, под которым выполнен вход."""

    login: str = Field(..., description="Логин")
