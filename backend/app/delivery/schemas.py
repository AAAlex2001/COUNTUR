from pydantic import BaseModel, ConfigDict, Field


class EstimateRequest(BaseModel):
    """Город получения, вес в граммах и размеры посылки в сантиметрах."""

    model_config = ConfigDict(str_strip_whitespace=True)

    city: str = Field(min_length=2, max_length=120)
    weight: int = Field(gt=0, le=1_000_000)
    length: int = Field(gt=0, le=500)
    width: int = Field(gt=0, le=500)
    height: int = Field(gt=0, le=500)

    def package(self) -> dict[str, int]:
        """Подготовить габариты посылки."""

        return {
            "weight": self.weight,
            "length": self.length,
            "width": self.width,
            "height": self.height,
        }


class DeliveryTariff(BaseModel):
    """Стоимость тарифа в рублях и диапазон сроков доставки в днях."""

    tariff_code: int
    tariff_name: str
    delivery_sum: float = Field(ge=0, allow_inf_nan=False)
    period_min: int = Field(ge=0)
    period_max: int = Field(ge=0)


class DeliveryAvailability(BaseModel):
    """Готовность настроек для расчёта доставки."""

    available: bool
