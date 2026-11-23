from app.landing.models import HeroContent
from app.landing.schemas import HeroContentSchema
from app.landing.services.repo import HeroContentRepository


class UpdateHeroContentUseCase:
    """Сохраняет тексты, кнопки, показатели и видимость первого экрана."""

    def __init__(self, hero_content: HeroContentRepository) -> None:
        self.hero_content = hero_content

    async def execute(self, payload: HeroContentSchema) -> HeroContent:
        content = await self.hero_content.get()

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

        return await self.hero_content.save(content)
