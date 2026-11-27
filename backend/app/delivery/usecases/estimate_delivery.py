from app.delivery.client import CdekClient
from app.delivery.exceptions import DeliveryNotConfiguredError
from app.delivery.schemas import DeliveryTariff, EstimateRequest


class EstimateDeliveryUseCase:
    """Рассчитать доставку посылки."""

    def __init__(self, carrier: CdekClient, origin_code: int, enabled: bool) -> None:
        """Запомнить маршрут отправителя."""

        self.carrier = carrier
        self.origin_code = origin_code
        self.enabled = enabled

    async def execute(self, shipment: EstimateRequest) -> list[DeliveryTariff]:
        """Подобрать тарифы по цене."""

        if not self.enabled:
            raise DeliveryNotConfiguredError("Расчёт доставки пока недоступен.")

        destination_code = await self.carrier.find_city_code(shipment.city)
        tariffs = await self.carrier.get_tariffs(
            origin_code=self.origin_code,
            destination_code=destination_code,
            shipment=shipment,
        )

        return sorted(tariffs, key=lambda tariff: tariff.delivery_sum)
