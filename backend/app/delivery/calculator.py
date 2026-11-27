from operator import attrgetter

from httpx import AsyncClient, Response
from pydantic import BaseModel, Field

from app.delivery.auth import CdekAuth
from app.delivery.schemas import DeliveryTariff, EstimateRequest


class TariffList(BaseModel):
    """Тарифы и ошибки, которые СДЭК может вернуть с HTTP 200."""

    tariff_codes: list[DeliveryTariff] = Field(default_factory=list)
    errors: list[dict] = Field(default_factory=list)


class CdekCalculator:
    """Запрашивает тарифы для отправки из настроенного города магазина."""

    def __init__(self, auth: CdekAuth, origin_city: int) -> None:
        self.auth = auth
        self.origin_city = origin_city

    async def estimate(
        self, client: AsyncClient, shipment: EstimateRequest
    ) -> list[DeliveryTariff]:
        """Возвращает тарифы по возрастанию цены, обновляя токен после отказа в доступе."""

        token = await self.auth.access_token(client)
        response = await self.request_tariffs(client, shipment, token)
        if response.status_code == 401:
            token = await self.auth.access_token(client, rejected=token)
            response = await self.request_tariffs(client, shipment, token)

        response.raise_for_status()
        result = TariffList.model_validate(response.json())
        if result.errors:
            raise ValueError("СДЭК отклонил расчёт")

        return sorted(result.tariff_codes, key=attrgetter("delivery_sum"))

    async def request_tariffs(
        self, client: AsyncClient, shipment: EstimateRequest, token: str
    ) -> Response:
        """Передаёт перевозчику маршрут и параметры одного грузового места."""

        package = {
            "weight": shipment.weight,
            "length": shipment.length,
            "width": shipment.width,
            "height": shipment.height,
        }
        return await client.post(
            "calculator/tarifflist",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "type": 1,
                "currency": 1,
                "lang": "rus",
                "from_location": {"code": self.origin_city},
                "to_location": {"country_code": "RU", "city": shipment.city},
                "packages": [package],
            },
        )
