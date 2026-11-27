from fastapi import UploadFile

from app.landing.images import replace_landing_image
from app.landing.models import Hero
from app.landing.repository import LandingRepository


class SetHeroImageUseCase:
    """Изображение первого экрана."""

    def __init__(self, landing: LandingRepository) -> None:
        """Подключить главную страницу."""

        self.landing = landing

    async def execute(self, file: UploadFile) -> Hero:
        """Заменить изображение первого экрана."""

        hero = await self.landing.edit_hero()
        await replace_landing_image(file, hero, self.landing)
        return hero
