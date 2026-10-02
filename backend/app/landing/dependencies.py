"""Главная страница: репозитории и фабрики сценариев."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.landing.services.repo import HeroRepository, PromotionRepository
from app.landing.services.usecases.manage_promotion import (
    SetPromotionImageUseCase,
    UpdatePromotionUseCase,
)
from app.landing.services.usecases.set_hero_image import SetHeroImageUseCase


def get_hero_repository(
    session: AsyncSession = Depends(get_session),
) -> HeroRepository:
    """Репозиторий первого экрана с сессией текущего запроса."""

    return HeroRepository(session)


def get_promotion_repository(
    session: AsyncSession = Depends(get_session),
) -> PromotionRepository:
    """Репозиторий рекламного блока с сессией текущего запроса."""

    return PromotionRepository(session)


def get_set_hero_image_usecase(
    heroes: HeroRepository = Depends(get_hero_repository),
) -> SetHeroImageUseCase:
    """Сценарий замены картинки первого экрана."""

    return SetHeroImageUseCase(heroes)


def get_update_promotion_usecase(
    promotions: PromotionRepository = Depends(get_promotion_repository),
) -> UpdatePromotionUseCase:
    """Сценарий изменения рекламного блока."""

    return UpdatePromotionUseCase(promotions)


def get_set_promotion_image_usecase(
    promotions: PromotionRepository = Depends(get_promotion_repository),
) -> SetPromotionImageUseCase:
    """Сценарий замены картинки рекламного блока."""

    return SetPromotionImageUseCase(promotions)
