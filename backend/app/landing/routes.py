from fastapi import APIRouter, Depends

from app.landing.dependencies import get_landing_repository
from app.landing.repository import LandingRepository
from app.landing.schemas import HeroContentSchema, HeroSchema, PromotionSchema

router = APIRouter(prefix="/landing", tags=["landing"])


@router.get("/hero")
async def get_hero(
    landing: LandingRepository = Depends(get_landing_repository),
) -> HeroSchema:
    """Первый экран."""

    hero = await landing.get_hero()
    if hero is None:
        return HeroSchema()

    return HeroSchema.model_validate(hero)


@router.get("/hero/content")
async def get_hero_content(
    landing: LandingRepository = Depends(get_landing_repository),
) -> HeroContentSchema:
    """Показать тексты первого экрана."""

    content = await landing.get_hero_content()
    return HeroContentSchema.model_validate(content)


@router.get("/promotion")
async def get_promotion(
    landing: LandingRepository = Depends(get_landing_repository),
) -> PromotionSchema | None:
    """Показать опубликованную акцию."""

    promotion = await landing.get_promotion()
    if promotion is None or not promotion.is_visible:
        return None

    return PromotionSchema.model_validate(promotion)
