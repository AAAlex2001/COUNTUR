from fastapi import APIRouter, Depends

from app.landing.dependencies import (
    get_hero_content_repository,
    get_hero_repository,
    get_promotion_repository,
)
from app.landing.schemas import HeroContentSchema, HeroSchema, PromotionSchema
from app.landing.services.repo import HeroContentRepository, HeroRepository, PromotionRepository

router = APIRouter(prefix="/landing", tags=["landing"])


@router.get("/hero")
async def get_hero(
    heroes: HeroRepository = Depends(get_hero_repository),
) -> HeroSchema:
    """Первый экран главной страницы."""

    hero = await heroes.get()
    if hero is None:
        return HeroSchema()

    return HeroSchema.model_validate(hero)


@router.get("/hero/content")
async def get_hero_content(
    hero_content: HeroContentRepository = Depends(get_hero_content_repository),
) -> HeroContentSchema:
    content = await hero_content.get()
    return HeroContentSchema.model_validate(content)


@router.get("/promotion")
async def get_promotion(
    promotions: PromotionRepository = Depends(get_promotion_repository),
) -> PromotionSchema | None:
    """Рекламный блок главной. Пусто, если блок не заполнен или скрыт администратором."""

    promotion = await promotions.get()
    if promotion is None or not promotion.is_visible:
        return None

    return PromotionSchema.model_validate(promotion)
