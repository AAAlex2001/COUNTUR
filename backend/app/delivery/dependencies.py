from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import Depends, Request
from httpx import AsyncClient

from app.config import Settings, get_settings
from app.delivery.client import CdekClient
from app.delivery.usecases.estimate_delivery import EstimateDeliveryUseCase


async def get_cdek_client(request: Request) -> AsyncIterator[CdekClient]:
    """Подключить клиента перевозчика."""

    async with AsyncClient(base_url="https://api.cdek.ru/v2/", timeout=10) as http:
        yield CdekClient(http=http, auth=request.app.state.cdek_auth)


def get_estimate_delivery_usecase(
    settings: Annotated[Settings, Depends(get_settings)],
    carrier: Annotated[CdekClient, Depends(get_cdek_client)],
) -> EstimateDeliveryUseCase:
    """Собрать сценарий расчёта."""

    return EstimateDeliveryUseCase(
        carrier=carrier,
        origin_code=settings.cdek_origin_city_code,
        enabled=settings.delivery_enabled,
    )
