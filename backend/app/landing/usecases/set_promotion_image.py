from app.landing.images import replace_landing_image
from app.landing.models import Promotion
from app.landing.repository import LandingRepository
from app.uploads import ImageUpload


class SetPromotionImageUseCase:
    """Изображение рекламного блока."""

    def __init__(self, landing: LandingRepository) -> None:
        """Подключить главную страницу."""

        self.landing = landing

    async def execute(self, file: ImageUpload) -> Promotion:
        """Заменить изображение акции."""

        promotion = await self.landing.edit_promotion()
        await replace_landing_image(file, promotion, self.landing)
        return promotion
