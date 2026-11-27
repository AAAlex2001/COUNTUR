from functools import lru_cache
from pathlib import Path

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class BotSettings(BaseSettings):
    """Параметры polling, личного чата владельца и подключения к базе."""

    model_config = SettingsConfigDict(
        env_file=PROJECT_ENV_FILE, env_file_encoding="utf-8", extra="ignore", hide_input_in_errors=True
    )

    telegram_bot_token: SecretStr = Field(min_length=1)
    admin_chat_id: int = Field(gt=0)
    database_url: str


@lru_cache
def get_bot_settings() -> BotSettings:
    """Читает настройки процесса из окружения или локального .env."""

    return BotSettings()
