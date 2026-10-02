from fastapi import APIRouter, Depends, HTTPException, UploadFile, status

from app.admin.dependencies import require_admin
from app.landing.dependencies import (
    get_promotion_repository,
    get_set_hero_image_usecase,
    get_set_promotion_image_usecase,
    get_update_promotion_usecase,
)
from app.landing.schemas import HeroSchema, PromotionSchema, PromotionUpdateSchema
from app.landing.services.repo import PromotionRepository
from app.landing.services.usecases.manage_promotion import (
    SetPromotionImageUseCase,
    UpdatePromotionUseCase,
)
from app.landing.services.usecases.set_hero_image import SetHeroImageUseCase
from app.uploads import UploadError

router = APIRouter(
    prefix="/admin/landing",
    tags=["admin: landing"],
    dependencies=[Depends(require_admin)],
)


@router.put("/hero/image")
async def set_hero_image(
    file: UploadFile,
    usecase: SetHeroImageUseCase = Depends(get_set_hero_image_usecase),
) -> HeroSchema:
    """Замена картинки первого экрана. Прежняя картинка удаляется."""

    try:
        hero = await usecase.execute(file)
    except UploadError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    return HeroSchema.model_validate(hero)


@router.get("/promotion")
async def get_promotion(
    promotions: PromotionRepository = Depends(get_promotion_repository),
) -> PromotionSchema:
    """Рекламный блок для редактирования, даже если он скрыт или ещё не заполнен."""

    promotion = await promotions.get()
    if promotion is None:
        return PromotionSchema()

    return PromotionSchema.model_validate(promotion)


@router.put("/promotion")
async def update_promotion(
    payload: PromotionUpdateSchema,
    usecase: UpdatePromotionUseCase = Depends(get_update_promotion_usecase),
) -> PromotionSchema:
    """Сохранение текстов, кнопки и видимости рекламного блока."""

    promotion = await usecase.execute(payload)

    return PromotionSchema.model_validate(promotion)


@router.put("/promotion/image")
async def set_promotion_image(
    file: UploadFile,
    usecase: SetPromotionImageUseCase = Depends(get_set_promotion_image_usecase),
) -> PromotionSchema:
    """Замена картинки рекламного блока. Прежняя картинка удаляется."""

    try:
        promotion = await usecase.execute(file)
    except UploadError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    return PromotionSchema.model_validate(promotion)
