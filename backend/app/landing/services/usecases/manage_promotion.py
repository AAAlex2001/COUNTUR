"""Сценарии рекламного блока главной: изменить содержимое и заменить картинку."""

from fastapi import UploadFile

from app.landing.models import Promotion
from app.landing.schemas import PromotionUpdateSchema
from app.landing.services.repo import PromotionRepository
from app.landing.services.usecases.set_hero_image import LANDING_FOLDER
from app.uploads import remove_image, save_image


class UpdatePromotionUseCase:
    """Сохранить тексты, кнопку и видимость рекламного блока."""

    def __init__(self, promotions: PromotionRepository) -> None:
        self.promotions = promotions

    async def execute(self, payload: PromotionUpdateSchema) -> Promotion:
        """Вернуть обновлённый блок. Если его ещё не было, он создаётся."""

        promotion = await self.promotions.get()
        if promotion is None:
            promotion = Promotion()

        for field, value in payload.model_dump().items():
            setattr(promotion, field, value)

        return await self.promotions.save(promotion)


class SetPromotionImageUseCase:
    """Загрузить новую картинку рекламного блока и удалить прежнюю."""

    def __init__(self, promotions: PromotionRepository) -> None:
        self.promotions = promotions

    async def execute(self, file: UploadFile) -> Promotion:
        """Вернуть блок с новой картинкой. Бросает UploadError, если файл не подходит."""

        path = await save_image(file, LANDING_FOLDER)

        promotion = await self.promotions.get()
        if promotion is None:
            promotion = Promotion()

        old_path = promotion.image_path
        promotion.image_path = path

        try:
            saved = await self.promotions.save(promotion)
        except Exception:
            remove_image(path)
            raise

        if old_path is not None:
            remove_image(old_path)

        return saved
