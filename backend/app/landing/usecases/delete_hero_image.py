from app.landing.images import remove_landing_image
from app.landing.models import Hero
from app.landing.repository import LandingRepository


class DeleteHeroImageUseCase:
    """Удаление изображения первого экрана."""

    def __init__(self, landing: LandingRepository) -> None:
        """Подключить главную страницу."""

        self.landing = landing

    async def execute(self) -> Hero | None:
        """Удалить изображение первого экрана."""

        hero = await self.landing.lock_hero()
        if hero is None or hero.image_path is None:
            return hero

        previous_path = hero.image_path
        hero.image_path = None
        await self.landing.save(hero)
        remove_landing_image(previous_path)
        return hero
