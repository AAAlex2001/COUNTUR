from asyncio import Lock
from time import monotonic

from httpx import AsyncClient
from pydantic import BaseModel, Field, SecretStr


class TokenResponse(BaseModel):
    """Токен доступа СДЭК и срок его действия в секундах."""

    access_token: SecretStr = Field(min_length=1)
    expires_in: int = Field(gt=0)


class CdekAuth:
    """Хранит токен до истечения срока и объединяет одновременные обновления."""

    def __init__(self, account: str, password: SecretStr) -> None:
        self.account = account
        self.password = password
        self.token = ""
        self.expires_at = 0.0
        self.lock = Lock()

    async def access_token(self, client: AsyncClient, rejected: str = "") -> str:
        """Возвращает действующий токен или заменяет отклонённый перевозчиком."""

        async with self.lock:
            if self.token != rejected and monotonic() < self.expires_at:
                return self.token

            response = await client.post(
                "oauth/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.account,
                    "client_secret": self.password.get_secret_value(),
                },
            )
            response.raise_for_status()
            credentials = TokenResponse.model_validate(response.json())
            self.token = credentials.access_token.get_secret_value()
            self.expires_at = monotonic() + max(0, credentials.expires_in - 30)
            return self.token
