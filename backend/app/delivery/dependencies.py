from collections.abc import AsyncIterator
from functools import lru_cache

from httpx import AsyncClient

from app.config import get_settings
from app.delivery.auth import CdekAuth
from app.delivery.calculator import CdekCalculator


@lru_cache
def get_calculator() -> CdekCalculator | None:
    """Создаёт калькулятор, когда заданы оба ключа СДЭК и город отправки."""

    settings = get_settings()
    if not settings.cdek_account or not settings.cdek_password.get_secret_value():
        return None
    if not settings.cdek_origin_city_code:
        return None

    auth = CdekAuth(settings.cdek_account, settings.cdek_password)
    return CdekCalculator(auth, settings.cdek_origin_city_code)


async def get_cdek_client() -> AsyncIterator[AsyncClient]:
    async with AsyncClient(base_url="https://api.cdek.ru/v2/", timeout=10) as client:
        yield client
