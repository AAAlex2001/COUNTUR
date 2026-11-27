from dataclasses import dataclass
from decimal import Decimal

from sqlalchemy import ColumnElement, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import Product, Review


@dataclass(frozen=True)
class ReviewFilter:
    """Отбор отзывов товара."""

    product_id: int
    published_only: bool

    def conditions(self) -> list[ColumnElement[bool]]:
        """Отобрать видимые отзывы."""

        conditions = [Review.product_id == self.product_id]
        if self.published_only:
            conditions.append(Review.is_published.is_(True))
        return conditions


class ReviewRepository:
    """Отзывы и рейтинг товара."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_for_product(
        self, filters: ReviewFilter, limit: int, offset: int
    ) -> list[Review]:
        """Получить отзывы товара."""

        query = (
            select(Review)
            .where(*filters.conditions())
            .order_by(Review.created_at.desc(), Review.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(await self.db.scalars(query))

    async def count_for_product(self, filters: ReviewFilter) -> int:
        """Посчитать отзывы товара."""

        query = select(func.count()).select_from(Review).where(*filters.conditions())
        return await self.db.scalar(query) or 0

    async def lock_for_edit(self, review_id: int) -> Review | None:
        """Открыть отзыв для изменения."""

        product = (
            select(Product.id)
            .join(Review, Review.product_id == Product.id)
            .where(Review.id == review_id)
            .with_for_update(of=Product)
        )
        await self.db.execute(product)
        return await self.db.get(Review, review_id)

    async def delete(self, review: Review) -> None:
        """Удалить отзыв."""

        await self.db.delete(review)

    async def commit(self) -> None:
        """Сохранить изменения отзывов."""

        await self.db.commit()

    async def refresh_rating(self, product_id: int) -> None:
        """Пересчитать рейтинг и число отзывов товара по опубликованным отзывам."""

        stats_stmt = select(func.avg(Review.rating), func.count(Review.id)).where(
            Review.product_id == product_id, Review.is_published.is_(True)
        )
        result = await self.db.execute(stats_stmt)
        average, count = result.one()

        rating = None
        if average is not None:
            rating = round(Decimal(str(average)), 1)

        update_stmt = (
            update(Product)
            .where(Product.id == product_id)
            .values(rating=rating, reviews_count=count)
        )
        await self.db.execute(update_stmt)
