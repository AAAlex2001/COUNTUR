from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

MEDIA_URL = "/media"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    db_pool_size: int = Field(20, ge=1, description="Постоянных соединений с БД на процесс")
    db_max_overflow: int = Field(10, ge=0, description="Сколько ещё можно открыть при всплеске")
    cors_origins: list[str] = []
    debug: bool = False

    media_dir: str = "media"
    cookie_secure: bool = True
    shop_timezone: str = "Europe/Moscow"

    jwt_secret: str = Field(min_length=32)
    jwt_expires_days: int = 7

    admin_login: str = "admin"
    admin_password: str = Field(min_length=8)

    smtp_host: str | None = Field(None, description="Без него ответы на обращения не уходят")
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = Field("", description="Адрес отправителя, по умолчанию — smtp_user")
    smtp_tls: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
