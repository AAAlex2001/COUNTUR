import logging

from httpx import Response
from pydantic import BaseModel, TypeAdapter, ValidationError

from app.delivery.exceptions import CarrierUnavailableError, InvalidShipmentError
from app.delivery.schemas import DeliveryTariff

logger = logging.getLogger(__name__)


class CdekCity(BaseModel):
    """Город СДЭК."""

    code: int
    city: str


class CdekTariffError(BaseModel):
    """Причина отказа СДЭК."""

    code: str


class CdekTariffList(BaseModel):
    """Ответ калькулятора СДЭК."""

    tariff_codes: list[DeliveryTariff] | None = None
    errors: list[CdekTariffError] | None = None

    def available_tariffs(self) -> list[DeliveryTariff]:
        """Получить рассчитанные тарифы."""

        if self.errors and not self.tariff_codes:
            logger.warning("CDEK calculator/tarifflist: %r", self.errors[0].code[:80])
            raise InvalidShipmentError("СДЭК не рассчитал доставку для этой посылки.")

        if self.tariff_codes is None:
            logger.warning("CDEK calculator/tarifflist: missing tariff_codes")
            raise CarrierUnavailableError("СДЭК вернул неполный ответ.")

        return self.tariff_codes


CITIES = TypeAdapter(list[CdekCity])


def check_response(response: Response) -> None:
    """Проверить доступность СДЭК."""

    if response.is_success:
        return

    logger.warning("CDEK %s: HTTP %s", response.request.url.path, response.status_code)
    raise CarrierUnavailableError("Сервис СДЭК временно недоступен.")


def read_city_code(response: Response, city_name: str | None) -> int:
    """Определить код города."""

    check_response(response)
    try:
        cities = CITIES.validate_json(response.content)
    except ValidationError as error:
        logger.warning("CDEK location/cities: invalid response")
        raise CarrierUnavailableError("Справочник городов СДЭК недоступен.") from error

    if city_name is not None:
        cities = [city for city in cities if city.city.casefold() == city_name.casefold()]

    codes = {city.code for city in cities}
    if not codes:
        raise InvalidShipmentError("Город не найден. Проверьте название или почтовый индекс.")
    if len(codes) > 1:
        raise InvalidShipmentError("Найдено несколько городов. Введите почтовый индекс.")

    return codes.pop()


def read_tariffs(response: Response) -> list[DeliveryTariff]:
    """Прочитать тарифы доставки."""

    if response.status_code in (400, 422):
        logger.warning("CDEK calculator/tarifflist: HTTP %s", response.status_code)
        raise InvalidShipmentError("СДЭК отклонил расчёт. Проверьте параметры посылки.")

    check_response(response)
    try:
        result = CdekTariffList.model_validate_json(response.content)
    except ValidationError as error:
        logger.warning("CDEK calculator/tarifflist: invalid response")
        raise CarrierUnavailableError("СДЭК вернул неполный ответ.") from error

    return result.available_tariffs()
