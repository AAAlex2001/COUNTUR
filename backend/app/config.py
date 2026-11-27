from functools import lru_cache

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.environment import PROJECT_ENV_FILE

MEDIA_URL = "/media"


class Settings(BaseSettings):
    """Настройки API из общего окружения магазина."""

    model_config = SettingsConfigDict(
        env_file=PROJECT_ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
        hide_input_in_errors=True,
    )

    database_url: str
    db_pool_size: int = Field(20, ge=1, description="Постоянных соединений с БД на процесс")
    db_max_overflow: int = Field(10, ge=0, description="Сколько ещё можно открыть при всплеске")
    cors_origins: list[str] = []
    debug: bool = False

    media_dir: str = "media"
    cookie_secure: bool = True
    shop_timezone: str = "Europe/Moscow"
    site_url: str = "https://24countur.ru"

    jwt_secret: str = Field(min_length=32)
    jwt_expires_days: int = 7

    admin_login: str = "admin"
    admin_password: str = Field(min_length=8)

    cdek_account: str = ""
    cdek_password: SecretStr = SecretStr("")
    cdek_origin_city_code: int = Field(0, ge=0)

    smtp_host: str | None = Field(None, description="SMTP-сервер для писем магазина")
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = Field("", description="Адрес отправителя, по умолчанию — smtp_user")
    smtp_tls: bool = True

    @property
    def delivery_enabled(self) -> bool:
        """Проверить настройки СДЭК."""

        return bool(
            self.cdek_account
            and self.cdek_password.get_secret_value()
            and self.cdek_origin_city_code > 0
        )


@lru_cache
def get_settings() -> Settings:
    """Прочитать настройки один раз при первом обращении."""

    return Settings()
