"""Сценарии работы с отзывами в админке."""

from app.catalog.models import Review
from app.catalog.schemas import ReviewUpdateSchema
from app.catalog.services.repo import ReviewRepository


class UpdateReviewUseCase:
    """Изменить отзыв или скрыть его с сайта."""

    def __init__(self, reviews: ReviewRepository) -> None:
        self.reviews = reviews

    async def execute(self, review: Review, payload: ReviewUpdateSchema) -> Review:
        """Вернуть обновлённый отзыв."""

        changes = payload.model_dump(exclude_unset=True, exclude_none=True)

        for field, value in changes.items():
            setattr(review, field, value)

        return await self.reviews.save(review)
