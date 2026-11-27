import logging
from asyncio import Lock
from time import monotonic

from httpx import AsyncClient
from pydantic import BaseModel, Field, SecretStr, ValidationError

from app.delivery.exceptions import CarrierUnavailableError

logger = logging.getLogger(__name__)


class CdekToken(BaseModel):
    """Токен доступа СДЭК."""

    access_token: SecretStr = Field(min_length=1)
    expires_in: int = Field(gt=0)


class CdekAuth:
    """Авторизация СДЭК."""

    def __init__(self, account: str, password: SecretStr) -> None:
        """Сохранить реквизиты СДЭК."""

        self.account = account
        self.password = password
        self.token = ""
        self.expires_at = 0.0
        self.lock = Lock()

    async def access_token(self, client: AsyncClient, rejected_token: str = "") -> str:
        """Получить действующий токен."""

        async with self.lock:
            if monotonic() < self.expires_at and self.token != rejected_token:
                return self.token

            credentials = await self.request_token(client)
            self.token = credentials.access_token.get_secret_value()
            self.expires_at = monotonic() + max(0, credentials.expires_in - 30)
            return self.token

    async def request_token(self, client: AsyncClient) -> CdekToken:
        """Запросить токен СДЭК."""

        response = await client.post(
            "oauth/token",
            data={
                "grant_type": "client_credentials",
                "client_id": self.account,
                "client_secret": self.password.get_secret_value(),
            },
        )
        response.raise_for_status()

        try:
            return CdekToken.model_validate_json(response.content)
        except ValidationError as error:
            logger.warning("CDEK oauth/token: invalid response")
            raise CarrierUnavailableError("СДЭК не подтвердил авторизацию.") from error
