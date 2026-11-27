import asyncio
import json
from urllib.parse import parse_qs

import pytest
from httpx import AsyncClient, ConnectError, MockTransport, Request, Response
from pydantic import SecretStr

from app.delivery.auth import CdekAuth
from app.delivery.client import CdekClient
from app.delivery.exceptions import CarrierUnavailableError, InvalidShipmentError
from app.delivery.responses import read_tariffs
from app.delivery.schemas import EstimateRequest
from app.delivery.usecases.estimate_delivery import EstimateDeliveryUseCase


def test_tariffs_refresh_rejected_token_and_reuse_replacement():
    tokens = []

    def respond(request: Request) -> Response:
        if request.url.path.endswith("/oauth/token"):
            assert parse_qs(request.content)[b"client_secret"] == [b"secret"]
            tokens.append(f"token-{len(tokens)}")
            return Response(200, json={"access_token": tokens[-1], "expires_in": 3600})

        if request.headers["Authorization"] == "Bearer token-0":
            return Response(401)

        if request.url.path.endswith("/location/cities"):
            assert request.url.params["city"] == "Омск"
            return Response(200, json=[{"city": "Омск", "code": 268}])

        payload = json.loads(request.content)
        assert payload["from_location"] == {"code": 44}
        assert payload["to_location"] == {"code": 268}
        assert payload["packages"] == [{"weight": 1500, "length": 30, "width": 20, "height": 10}]
        tariff = {"tariff_code": 1, "tariff_name": "Склад", "period_min": 2, "period_max": 4}
        return Response(
            200, json={"tariff_codes": [dict(tariff, delivery_sum=p) for p in (600, 300)]}
        )

    async def calculate():
        auth = CdekAuth("account", SecretStr("secret"))
        shipment = EstimateRequest(city=" Омск ", weight=1500, length=30, width=20, height=10)
        async with AsyncClient(
            base_url="https://example.test/", transport=MockTransport(respond)
        ) as client:
            carrier = CdekClient(client, auth)
            usecase = EstimateDeliveryUseCase(carrier, origin_code=44, enabled=True)
            for _ in range(2):
                tariffs = await usecase.execute(shipment)
                assert [tariff.delivery_sum for tariff in tariffs] == [300, 600]

    asyncio.run(calculate())
    assert tokens == ["token-0", "token-1"]


@pytest.mark.parametrize(
    ("cities", "message"),
    [
        ([], "Город не найден"),
        ([{"city": "Омск", "code": 1}, {"city": "Омск", "code": 2}], "почтовый индекс"),
    ],
)
def test_destination_must_identify_one_city(cities, message):
    def respond(request: Request) -> Response:
        if request.url.path.endswith("/oauth/token"):
            return Response(200, json={"access_token": "token", "expires_in": 3600})
        assert request.url.path.endswith("/location/cities")
        return Response(200, json=cities)

    async def find():
        async with AsyncClient(
            base_url="https://example.test/", transport=MockTransport(respond)
        ) as client:
            carrier = CdekClient(client, CdekAuth("account", SecretStr("secret")))
            return await carrier.find_city_code("Омск")

    with pytest.raises(InvalidShipmentError) as error:
        asyncio.run(find())
    assert message in str(error.value)


def test_connection_failure_logs_endpoint_without_credentials(caplog):
    def offline(request: Request) -> Response:
        raise ConnectError("sensitive-error-details", request=request)

    async def find():
        async with AsyncClient(
            base_url="https://example.test/", transport=MockTransport(offline)
        ) as client:
            carrier = CdekClient(client, CdekAuth("account", SecretStr("secret")))
            return await carrier.find_city_code("Ангарск")

    with pytest.raises(CarrierUnavailableError):
        asyncio.run(find())
    assert "/oauth/token: ConnectError" in caplog.text
    assert "sensitive-error-details" not in caplog.text


@pytest.mark.parametrize(
    ("status", "data", "exception"),
    [
        (400, {}, InvalidShipmentError),
        (422, {}, InvalidShipmentError),
        (502, {}, CarrierUnavailableError),
        (200, {"errors": [{"code": "invalid_package"}]}, InvalidShipmentError),
        (200, {"tariff_codes": "missing list"}, CarrierUnavailableError),
        (200, {}, CarrierUnavailableError),
    ],
)
def test_tariff_response_distinguishes_invalid_shipment_from_carrier_failure(
    status, data, exception
):
    request = Request("POST", "https://example.test/v2/calculator/tarifflist")
    response = Response(status, json=data, request=request)

    with pytest.raises(exception):
        read_tariffs(response)
