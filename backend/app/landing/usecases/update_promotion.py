from app.landing.models import Promotion
from app.landing.repository import LandingRepository
from app.landing.schemas import PromotionUpdateSchema


class UpdatePromotionUseCase:
    """Настройки рекламного блока."""

    def __init__(self, landing: LandingRepository) -> None:
        """Подключить главную страницу."""

        self.landing = landing

    async def execute(self, payload: PromotionUpdateSchema) -> Promotion:
        """Обновить рекламный блок."""

        promotion = await self.landing.edit_promotion()
        promotion.label = payload.label
        promotion.title = payload.title
        promotion.text = payload.text
        promotion.button_label = payload.button_label
        promotion.button_url = payload.button_url
        promotion.is_visible = payload.is_visible

        await self.landing.save(promotion)
        return promotion
