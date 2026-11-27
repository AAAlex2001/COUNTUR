import asyncio
import json
from urllib.parse import parse_qs

from httpx import AsyncClient, MockTransport, Request, Response
from pydantic import SecretStr

from app.delivery.auth import CdekAuth
from app.delivery.calculator import CdekCalculator
from app.delivery.schemas import EstimateRequest


def test_tariffs_refresh_rejected_token_and_reuse_replacement():
    tokens = []

    def respond(request: Request) -> Response:
        if request.url.path.endswith("/oauth/token"):
            assert parse_qs(request.content)[b"client_secret"] == [b"secret"]
            tokens.append(f"token-{len(tokens)}")
            return Response(200, json={"access_token": tokens[-1], "expires_in": 3600})

        if request.headers["Authorization"] == "Bearer token-0":
            return Response(401)

        payload = json.loads(request.content)
        assert payload["from_location"] == {"code": 44}
        assert payload["to_location"] == {"country_code": "RU", "city": "Омск"}
        assert payload["packages"] == [{"weight": 1500, "length": 30, "width": 20, "height": 10}]
        tariff = {"tariff_code": 1, "tariff_name": "Склад", "period_min": 2, "period_max": 4}
        return Response(
            200, json={"tariff_codes": [dict(tariff, delivery_sum=p) for p in (600, 300)]}
        )

    async def calculate():
        calculator = CdekCalculator(CdekAuth("account", SecretStr("secret")), origin_city=44)
        shipment = EstimateRequest(city=" Омск ", weight=1500, length=30, width=20, height=10)
        async with AsyncClient(
            base_url="https://example.test/", transport=MockTransport(respond)
        ) as client:
            for _ in range(2):
                tariffs = await calculator.estimate(client, shipment)
                assert [tariff.delivery_sum for tariff in tariffs] == [300, 600]

    asyncio.run(calculate())
    assert tokens == ["token-0", "token-1"]
