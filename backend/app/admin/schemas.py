from pydantic import BaseModel, ConfigDict, Field


class AdminLoginSchema(BaseModel):
    """Данные для входа в административную панель."""

    login: str = Field(..., min_length=1, max_length=64, description="Логин")
    password: str = Field(..., min_length=1, max_length=128, description="Пароль")


class AdminOutSchema(BaseModel):
    """Администратор, под которым выполнен вход."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID администратора")
    login: str = Field(..., description="Логин")
