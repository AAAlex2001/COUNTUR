"""Репозитории главной страницы: запросы к таблицам landing_hero и landing_promotion."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.landing.models import Hero, HeroContent, Promotion

HERO_CONTENT_ID = 1


class HeroRepository:
    """Доступ к единственной строке первого экрана. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self, for_update: bool = False) -> Hero | None:
        """Первый экран или None, если его ещё не настраивали."""

        query = select(Hero).order_by(Hero.id).limit(1)
        if for_update:
            query = query.with_for_update()
        result = await self.db.execute(query)

        return result.scalars().first()

    async def save(self, hero: Hero) -> Hero:
        """Сохранить первый экран."""

        self.db.add(hero)
        await self.db.commit()

        return hero


class HeroContentRepository:
    """Доступ к настройкам текста первого экрана."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self) -> HeroContent:
        """Возвращает тексты и показатели первого экрана."""

        query = select(HeroContent).where(HeroContent.id == HERO_CONTENT_ID)
        result = await self.db.execute(query)
        return result.scalar_one()

    async def save(self, content: HeroContent) -> HeroContent:
        """Фиксирует изменения содержимого первого экрана."""

        await self.db.commit()
        return content


class PromotionRepository:
    """Доступ к единственной строке рекламного блока. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self) -> Promotion | None:
        """Рекламный блок или None, если его ещё не заполняли."""

        result = await self.db.execute(select(Promotion))

        return result.scalars().first()

    async def save(self, promotion: Promotion) -> Promotion:
        """Сохранить рекламный блок."""

        self.db.add(promotion)
        await self.db.commit()
        await self.db.refresh(promotion)

        return promotion
