from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.landing.models import Hero, HeroContent, Promotion

HERO_CONTENT_ID = 1
FIRST_HERO = select(Hero).order_by(Hero.id).limit(1)
FIRST_PROMOTION = select(Promotion).order_by(Promotion.id).limit(1)


class LandingRepository:
    """Содержимое главной страницы."""

    def __init__(self, db: AsyncSession) -> None:
        """Подключить сессию базы."""

        self.db = db

    async def get_hero(self) -> Hero | None:
        """Получить первый экран."""

        return await self.db.scalar(FIRST_HERO)

    async def lock_hero(self) -> Hero | None:
        """Открыть изображение для изменения."""

        return await self.db.scalar(FIRST_HERO.with_for_update())

    async def edit_hero(self) -> Hero:
        """Подготовить первый экран."""

        hero = await self.lock_hero()
        if hero is not None:
            return hero

        await self.db.execute(insert(Hero).values(id=1).on_conflict_do_nothing())
        result = await self.db.scalars(FIRST_HERO.with_for_update())
        return result.one()

    async def get_hero_content(self) -> HeroContent:
        """Получить тексты первого экрана."""

        query = select(HeroContent).where(HeroContent.id == HERO_CONTENT_ID)
        result = await self.db.scalars(query)
        return result.one()

    async def get_promotion(self) -> Promotion | None:
        """Найти рекламный блок."""

        return await self.db.scalar(FIRST_PROMOTION)

    async def edit_promotion(self) -> Promotion:
        """Открыть акцию для изменения."""

        query = FIRST_PROMOTION.with_for_update()
        promotion = await self.db.scalar(query)
        if promotion is not None:
            return promotion

        await self.db.execute(insert(Promotion).values(id=1).on_conflict_do_nothing())
        result = await self.db.scalars(query)
        return result.one()

    async def save(self, block: Hero | HeroContent | Promotion) -> None:
        """Сохранить блок главной."""

        self.db.add(block)
        await self.db.commit()
