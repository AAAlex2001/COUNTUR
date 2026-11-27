from app.landing.models import Hero
from app.landing.services.images import remove_hero_image_file
from app.landing.services.repo import HeroRepository


class DeleteHeroImageUseCase:
    """Убирает картинку первого экрана и удаляет её файл."""

    def __init__(self, heroes: HeroRepository) -> None:
        self.heroes = heroes

    async def execute(self) -> Hero | None:
        """Снимает ссылку в базе перед удалением файла."""

        hero = await self.heroes.get(for_update=True)
        if hero is None or hero.image_path is None:
            return hero

        old_path = hero.image_path
        hero.image_path = None
        await self.heroes.save(hero)
        remove_hero_image_file(old_path)

        return hero
