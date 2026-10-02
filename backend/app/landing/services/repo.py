"""Репозитории главной страницы: запросы к таблицам landing_hero и landing_promotion."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.landing.models import Hero, Promotion


class HeroRepository:
    """Доступ к единственной строке первого экрана. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self) -> Hero | None:
        """Первый экран или None, если его ещё не настраивали."""

        result = await self.db.execute(select(Hero))

        return result.scalars().first()

    async def save(self, hero: Hero) -> Hero:
        """Сохранить первый экран."""

        self.db.add(hero)
        await self.db.commit()
        await self.db.refresh(hero)

        return hero


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
