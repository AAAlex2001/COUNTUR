"""Сценарий замены картинки первого экрана."""

from fastapi import UploadFile

from app.landing.models import Hero
from app.landing.services.images import remove_hero_image_file
from app.landing.services.repo import HeroRepository
from app.uploads import save_image

LANDING_FOLDER = "landing"


class SetHeroImageUseCase:
    """Загрузить новую картинку первого экрана и удалить прежнюю."""

    def __init__(self, heroes: HeroRepository) -> None:
        self.heroes = heroes

    async def execute(self, file: UploadFile) -> Hero:
        """Вернуть первый экран с новой картинкой. Бросает UploadError, если файл не подходит."""

        path = await save_image(file, LANDING_FOLDER)

        try:
            hero = await self.heroes.get(for_update=True)
            if hero is None:
                hero = Hero()

            old_path = hero.image_path
            hero.image_path = path
            saved = await self.heroes.save(hero)
        except Exception:
            remove_hero_image_file(path)
            raise

        if old_path is not None:
            remove_hero_image_file(old_path)

        return saved
