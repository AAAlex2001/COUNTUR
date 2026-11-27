"""Сценарии работы с отзывами в админке."""

from app.catalog.models import Review
from app.catalog.repositories.reviews import ReviewRepository
from app.catalog.schemas import ReviewUpdateSchema


class UpdateReviewUseCase:
    """Изменить отзыв или скрыть его с сайта."""

    def __init__(self, reviews: ReviewRepository) -> None:
        self.reviews = reviews

    async def execute(self, review: Review, payload: ReviewUpdateSchema) -> Review:
        """Вернуть обновлённый отзыв."""

        if payload.author_name is not None:
            review.author_name = payload.author_name
        if payload.rating is not None:
            review.rating = payload.rating
        if payload.text is not None:
            review.text = payload.text
        if payload.is_published is not None:
            review.is_published = payload.is_published

        await self.reviews.refresh_rating(review.product_id)
        await self.reviews.commit()
        return review


class DeleteReviewUseCase:
    """Удаление отзыва."""

    def __init__(self, reviews: ReviewRepository) -> None:
        """Подключить отзывы."""

        self.reviews = reviews

    async def execute(self, review: Review) -> None:
        """Удалить отзыв и обновить рейтинг."""

        await self.reviews.delete(review)
        await self.reviews.refresh_rating(review.product_id)
        await self.reviews.commit()
