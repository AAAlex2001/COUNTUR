from fastapi import Depends

from app.database import DatabaseSession
from app.landing.repository import LandingRepository
from app.landing.usecases.delete_hero_image import DeleteHeroImageUseCase
from app.landing.usecases.set_hero_image import SetHeroImageUseCase
from app.landing.usecases.set_promotion_image import SetPromotionImageUseCase
from app.landing.usecases.update_hero_content import UpdateHeroContentUseCase
from app.landing.usecases.update_promotion import UpdatePromotionUseCase


def get_landing_repository(db: DatabaseSession) -> LandingRepository:
    """Открыть содержимое главной."""

    return LandingRepository(db=db)


def get_update_hero_content_usecase(
    landing: LandingRepository = Depends(get_landing_repository),
) -> UpdateHeroContentUseCase:
    """Подготовить обновление первого экрана."""

    return UpdateHeroContentUseCase(landing=landing)


def get_set_hero_image_usecase(
    landing: LandingRepository = Depends(get_landing_repository),
) -> SetHeroImageUseCase:
    """Подготовить замену изображения."""

    return SetHeroImageUseCase(landing=landing)


def get_delete_hero_image_usecase(
    landing: LandingRepository = Depends(get_landing_repository),
) -> DeleteHeroImageUseCase:
    """Подготовить удаление изображения."""

    return DeleteHeroImageUseCase(landing=landing)


def get_update_promotion_usecase(
    landing: LandingRepository = Depends(get_landing_repository),
) -> UpdatePromotionUseCase:
    """Подготовить обновление акции."""

    return UpdatePromotionUseCase(landing=landing)


def get_set_promotion_image_usecase(
    landing: LandingRepository = Depends(get_landing_repository),
) -> SetPromotionImageUseCase:
    """Подготовить изображение акции."""

    return SetPromotionImageUseCase(landing=landing)
