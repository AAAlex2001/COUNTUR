import logging

from httpx import AsyncClient, HTTPStatusError, Request, RequestError, Response

from app.delivery.auth import CdekAuth
from app.delivery.exceptions import CarrierUnavailableError
from app.delivery.responses import read_city_code, read_tariffs
from app.delivery.schemas import DeliveryTariff, EstimateRequest

logger = logging.getLogger(__name__)


class CdekClient:
    """Клиент СДЭК."""

    def __init__(self, http: AsyncClient, auth: CdekAuth) -> None:
        """Подключить авторизацию СДЭК."""

        self.http = http
        self.auth = auth

    async def find_city_code(self, destination: str) -> int:
        """Найти код города."""

        is_postcode = len(destination) == 6 and destination.isascii() and destination.isdigit()
        field = "postal_code" if is_postcode else "city"
        request = self.http.build_request(
            "GET", "location/cities", params={field: destination, "country_codes": "RU"}
        )
        response = await self.send(request)

        return read_city_code(response, city_name=None if is_postcode else destination)

    async def get_tariffs(
        self, origin_code: int, destination_code: int, shipment: EstimateRequest
    ) -> list[DeliveryTariff]:
        """Получить тарифы СДЭК."""

        payload = {
            "type": 1,
            "currency": 1,
            "lang": "rus",
            "from_location": {"code": origin_code},
            "to_location": {"code": destination_code},
            "packages": [shipment.package()],
        }
        request = self.http.build_request("POST", "calculator/tarifflist", json=payload)
        response = await self.send(request)

        return read_tariffs(response)

    async def send(self, request: Request) -> Response:
        """Отправить запрос СДЭК."""

        try:
            token = await self.auth.access_token(self.http)
            request.headers["Authorization"] = f"Bearer {token}"
            response = await self.http.send(request)
            if response.status_code != 401:
                return response

            token = await self.auth.access_token(self.http, rejected_token=token)
            request.headers["Authorization"] = f"Bearer {token}"
            return await self.http.send(request)
        except HTTPStatusError as error:
            logger.warning("CDEK %s: HTTP %s", error.request.url.path, error.response.status_code)
            raise CarrierUnavailableError("СДЭК не подтвердил авторизацию.") from error
        except RequestError as error:
            logger.warning("CDEK %s: %s", error.request.url.path, type(error).__name__)
            raise CarrierUnavailableError(
                "Не удалось соединиться со СДЭК. Попробуйте позже."
            ) from error
