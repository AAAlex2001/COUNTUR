"""Сценарий замены картинки первого экрана."""

from fastapi import UploadFile

from app.landing.models import Hero
from app.landing.services.repo import HeroRepository
from app.uploads import remove_image, save_image

LANDING_FOLDER = "landing"


class SetHeroImageUseCase:
    """Загрузить новую картинку первого экрана и удалить прежнюю."""

    def __init__(self, heroes: HeroRepository) -> None:
        self.heroes = heroes

    async def execute(self, file: UploadFile) -> Hero:
        """Вернуть первый экран с новой картинкой. Бросает UploadError, если файл не подходит."""

        path = await save_image(file, LANDING_FOLDER)

        hero = await self.heroes.get()
        if hero is None:
            hero = Hero()

        old_path = hero.image_path
        hero.image_path = path

        try:
            saved = await self.heroes.save(hero)
        except Exception:
            remove_image(path)
            raise

        if old_path is not None:
            remove_image(old_path)

        return saved
