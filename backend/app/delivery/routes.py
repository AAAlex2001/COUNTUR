from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from app.config import Settings, get_settings
from app.delivery.dependencies import get_estimate_delivery_usecase
from app.delivery.exceptions import (
    CarrierUnavailableError,
    DeliveryNotConfiguredError,
    InvalidShipmentError,
)
from app.delivery.schemas import DeliveryAvailability, DeliveryTariff, EstimateRequest
from app.delivery.usecases.estimate_delivery import EstimateDeliveryUseCase

router = APIRouter(prefix="/delivery", tags=["delivery"])


@router.get("/availability")
async def delivery_availability(
    settings: Annotated[Settings, Depends(get_settings)],
) -> DeliveryAvailability:
    """Проверить доступность расчёта."""

    return DeliveryAvailability(available=settings.delivery_enabled)


@router.post("/estimate")
async def estimate_delivery(
    shipment: EstimateRequest,
    usecase: Annotated[EstimateDeliveryUseCase, Depends(get_estimate_delivery_usecase)],
) -> list[DeliveryTariff]:
    """Рассчитать доставку заказа."""

    try:
        return await usecase.execute(shipment)
    except InvalidShipmentError as error:
        raise HTTPException(422, str(error)) from error
    except DeliveryNotConfiguredError as error:
        raise HTTPException(503, str(error)) from error
    except CarrierUnavailableError as error:
        raise HTTPException(502, str(error)) from error
