from fastapi import APIRouter, Depends, HTTPException, UploadFile, status

from app.admin.dependencies import require_admin
from app.landing.dependencies import (
    get_delete_hero_image_usecase,
    get_landing_repository,
    get_set_hero_image_usecase,
    get_set_promotion_image_usecase,
    get_update_hero_content_usecase,
    get_update_promotion_usecase,
)
from app.landing.repository import LandingRepository
from app.landing.schemas import (
    HeroContentSchema,
    HeroSchema,
    PromotionSchema,
    PromotionUpdateSchema,
)
from app.landing.usecases.delete_hero_image import DeleteHeroImageUseCase
from app.landing.usecases.set_hero_image import SetHeroImageUseCase
from app.landing.usecases.set_promotion_image import SetPromotionImageUseCase
from app.landing.usecases.update_hero_content import UpdateHeroContentUseCase
from app.landing.usecases.update_promotion import UpdatePromotionUseCase
from app.uploads import UploadError

router = APIRouter(
    prefix="/admin/landing",
    tags=["admin: landing"],
    dependencies=[Depends(require_admin)],
)


@router.get("/hero/content")
async def get_hero_content(
    landing: LandingRepository = Depends(get_landing_repository),
) -> HeroContentSchema:
    """Открыть редактор первого экрана."""

    content = await landing.get_hero_content()
    return HeroContentSchema.model_validate(content)


@router.put("/hero/content")
async def update_hero_content(
    payload: HeroContentSchema,
    usecase: UpdateHeroContentUseCase = Depends(get_update_hero_content_usecase),
) -> HeroContentSchema:
    """Обновить первый экран."""

    content = await usecase.execute(payload)
    return HeroContentSchema.model_validate(content)


@router.put("/hero/image")
async def set_hero_image(
    file: UploadFile,
    usecase: SetHeroImageUseCase = Depends(get_set_hero_image_usecase),
) -> HeroSchema:
    """Заменить изображение первого экрана."""

    try:
        hero = await usecase.execute(file)
    except UploadError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    return HeroSchema.model_validate(hero)


@router.delete("/hero/image")
async def delete_hero_image(
    usecase: DeleteHeroImageUseCase = Depends(get_delete_hero_image_usecase),
) -> HeroSchema:
    """Удалить изображение первого экрана."""

    hero = await usecase.execute()
    if hero is None:
        return HeroSchema()

    return HeroSchema.model_validate(hero)


@router.get("/promotion")
async def get_promotion(
    landing: LandingRepository = Depends(get_landing_repository),
) -> PromotionSchema:
    """Открыть редактор акции."""

    promotion = await landing.get_promotion()
    if promotion is None:
        return PromotionSchema()

    return PromotionSchema.model_validate(promotion)


@router.put("/promotion")
async def update_promotion(
    payload: PromotionUpdateSchema,
    usecase: UpdatePromotionUseCase = Depends(get_update_promotion_usecase),
) -> PromotionSchema:
    """Сохранить настройки акции."""

    promotion = await usecase.execute(payload)

    return PromotionSchema.model_validate(promotion)


@router.put("/promotion/image")
async def set_promotion_image(
    file: UploadFile,
    usecase: SetPromotionImageUseCase = Depends(get_set_promotion_image_usecase),
) -> PromotionSchema:
    """Заменить изображение акции."""

    try:
        promotion = await usecase.execute(file)
    except UploadError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    return PromotionSchema.model_validate(promotion)
