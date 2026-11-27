from app.landing.models import HeroContent
from app.landing.repository import LandingRepository
from app.landing.schemas import HeroContentSchema


class UpdateHeroContentUseCase:
    """Настройки первого экрана."""

    def __init__(self, landing: LandingRepository) -> None:
        """Подключить главную страницу."""

        self.landing = landing

    async def execute(self, payload: HeroContentSchema) -> HeroContent:
        """Обновить первый экран."""

        content = await self.landing.get_hero_content()

        content.is_visible = payload.is_visible
        content.overline = payload.overline
        content.title = payload.title
        content.description = payload.description
        content.catalog_button_label = payload.catalog_button_label
        content.support_button_label = payload.support_button_label
        content.image_alt = payload.image_alt
        content.image_badge = payload.image_badge
        content.statistics = [
            {"value": statistic.value, "label": statistic.label}
            for statistic in payload.statistics
            if statistic.value or statistic.label
        ]

        await self.landing.save(content)
        return content
