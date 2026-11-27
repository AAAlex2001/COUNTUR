from fastapi import APIRouter, Depends, HTTPException
from httpx import AsyncClient, HTTPError

from app.delivery.calculator import CdekCalculator
from app.delivery.dependencies import get_calculator, get_cdek_client
from app.delivery.schemas import DeliveryAvailability, DeliveryTariff, EstimateRequest

router = APIRouter(prefix="/delivery", tags=["delivery"])


@router.get("/availability")
async def delivery_availability(
    calculator: CdekCalculator | None = Depends(get_calculator),
) -> DeliveryAvailability:
    """Сообщает витрине, можно ли показывать форму расчёта."""

    return DeliveryAvailability(available=calculator is not None)


@router.post("/estimate")
async def estimate_delivery(
    shipment: EstimateRequest,
    client: AsyncClient = Depends(get_cdek_client),
    calculator: CdekCalculator | None = Depends(get_calculator),
) -> list[DeliveryTariff]:
    """Рассчитывает предварительную стоимость и сроки доставки."""

    if calculator is None:
        raise HTTPException(503, "Расчёт доставки пока недоступен")

    try:
        return await calculator.estimate(client, shipment)
    except (HTTPError, ValueError) as error:
        raise HTTPException(502, "Не удалось получить тарифы СДЭК") from error
