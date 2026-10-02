"""Сценарии работы с отзывами. Отзывы добавляет и публикует администратор."""

from app.catalog.models import Product, Review
from app.catalog.schemas import ReviewCreateSchema, ReviewUpdateSchema
from app.catalog.services.repo import ReviewRepository


class CreateReviewUseCase:
    """Добавить отзыв о товаре. Рейтинг товара пересчитывается при сохранении."""

    def __init__(self, reviews: ReviewRepository) -> None:
        self.reviews = reviews

    async def execute(self, product: Product, payload: ReviewCreateSchema) -> Review:
        """Вернуть сохранённый отзыв."""

        review = Review(
            product_id=product.id,
            author_name=payload.author_name,
            rating=payload.rating,
            text=payload.text,
            is_published=payload.is_published,
        )

        return await self.reviews.add(review)


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
