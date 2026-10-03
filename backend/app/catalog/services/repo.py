"""Репозитории каталога: только запросы к таблицам категорий, брендов, товаров и отзывов."""

from dataclasses import dataclass, field
from decimal import Decimal

from sqlalchemy import ColumnElement, and_, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import (
    Attribute,
    Availability,
    Brand,
    Category,
    Product,
    ProductSpec,
    PublicationStatus,
    Review,
)
from app.slugs import unique_slug

PUBLISHED = Product.status == PublicationStatus.PUBLISHED

PRODUCT_SORTS = {
    "popular": [
        Product.sort_order,
        Product.is_hit.desc(),
        Product.reviews_count.desc(),
        Product.name,
    ],
    "price_asc": [Product.price, Product.name],
    "price_desc": [Product.price.desc(), Product.name],
    "name_asc": [Product.name],
    "name_desc": [Product.name.desc()],
}


@dataclass(frozen=True)
class ProductFilters:
    """Условия отбора товаров в каталоге. Пустое значение — фильтр не применяется."""

    search: str | None = None
    category_slugs: list[str] = field(default_factory=list)
    brand_slugs: list[str] = field(default_factory=list)
    in_stock: bool = False
    featured: bool = False
    price_min: Decimal | None = None
    price_max: Decimal | None = None
    specs: dict[int, list[str]] = field(default_factory=dict)


def build_conditions(filters: ProductFilters) -> list[ColumnElement[bool]]:
    """Перевести фильтры каталога в условия запроса. Черновики не попадают никогда."""

    conditions: list[ColumnElement[bool]] = [PUBLISHED]

    if filters.search:
        conditions.append(Product.name.icontains(filters.search, autoescape=True))

    if filters.category_slugs:
        conditions.append(Product.category.has(Category.slug.in_(filters.category_slugs)))

    if filters.brand_slugs:
        conditions.append(Product.brand.has(Brand.slug.in_(filters.brand_slugs)))

    if filters.in_stock:
        conditions.append(Product.availability == Availability.IN_STOCK)

    if filters.featured:
        conditions.append(or_(Product.is_hit.is_(True), Product.old_price.is_not(None)))

    if filters.price_min is not None:
        conditions.append(Product.price >= filters.price_min)

    if filters.price_max is not None:
        conditions.append(Product.price <= filters.price_max)

    for attribute_id, values in filters.specs.items():
        has_value = Product.specs.any(
            and_(ProductSpec.attribute_id == attribute_id, ProductSpec.value.in_(values))
        )
        conditions.append(has_value)

    return conditions


class CategoryRepository:
    """Доступ к таблицам categories и attributes. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_with_counts(self) -> list[tuple[Category, int]]:
        """Все категории по порядку и число опубликованных товаров в каждой."""

        stmt = (
            select(Category, func.count(Product.id))
            .outerjoin(Product, and_(Product.category_id == Category.id, PUBLISHED))
            .group_by(Category.id)
            .order_by(Category.sort_order, Category.name)
        )
        result = await self.db.execute(stmt)

        return [(category, count) for category, count in result.all()]

    async def list_all(self) -> list[Category]:
        """Все категории по порядку вместе с параметрами."""

        stmt = select(Category).order_by(Category.sort_order, Category.name)
        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_by_id(self, category_id: int) -> Category | None:
        """Категория по идентификатору или None."""

        return await self.db.get(Category, category_id)

    async def get_by_slug(self, slug: str) -> Category | None:
        """Категория по адресу или None."""

        stmt = select(Category).where(Category.slug == slug)
        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def unique_slug(self, wanted: str, exclude_id: int | None = None) -> str:
        """Свободный slug категории на основе wanted."""

        return await unique_slug(self.db, Category, wanted, exclude_id)

    async def has_products(self, category_id: int) -> bool:
        """Есть ли в категории хоть один товар, включая черновики."""

        stmt = select(Product.id).where(Product.category_id == category_id).limit(1)

        return await self.db.scalar(stmt) is not None

    async def get_attribute(self, attribute_id: int) -> Attribute | None:
        """Параметр категории по идентификатору или None."""

        return await self.db.get(Attribute, attribute_id)

    async def attribute_exists(
        self, category_id: int, name: str, exclude_id: int | None = None
    ) -> bool:
        """Есть ли в категории параметр с таким названием."""

        stmt = select(Attribute.id).where(
            Attribute.category_id == category_id, Attribute.name == name
        )
        if exclude_id is not None:
            stmt = stmt.where(Attribute.id != exclude_id)

        return await self.db.scalar(stmt) is not None

    async def add(self, category: Category) -> Category:
        """Сохранить новую категорию и вернуть её перечитанной из базы."""

        self.db.add(category)
        await self.db.commit()

        return await self.reload(category.id)

    async def add_attribute(self, attribute: Attribute) -> Category:
        """Добавить параметр и вернуть его категорию перечитанной."""

        self.db.add(attribute)
        await self.db.commit()

        return await self.reload(attribute.category_id)

    async def save(self, category_id: int) -> Category:
        """Сохранить изменения категории или её параметров и вернуть её перечитанной."""

        await self.db.commit()

        return await self.reload(category_id)

    async def delete(self, category: Category) -> None:
        """Удалить категорию. Её параметры удаляются вместе с ней."""

        await self.db.delete(category)
        await self.db.commit()

    async def delete_attribute(self, attribute: Attribute) -> None:
        """Удалить параметр. Его значения у товаров база удаляет каскадом."""

        await self.db.delete(attribute)
        await self.db.commit()

    async def reload(self, category_id: int) -> Category:
        """Перечитать категорию из базы после записи вместе с параметрами."""

        stmt = (
            select(Category)
            .where(Category.id == category_id)
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(stmt)

        return result.scalar_one()


class BrandRepository:
    """Доступ к таблице brands. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_all(self) -> list[Brand]:
        """Все бренды по алфавиту."""

        stmt = select(Brand).order_by(Brand.name)
        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_by_id(self, brand_id: int) -> Brand | None:
        """Бренд по идентификатору или None."""

        return await self.db.get(Brand, brand_id)

    async def unique_slug(self, wanted: str, exclude_id: int | None = None) -> str:
        """Свободный slug бренда на основе wanted."""

        return await unique_slug(self.db, Brand, wanted, exclude_id)

    async def add(self, brand: Brand) -> Brand:
        """Сохранить новый бренд."""

        self.db.add(brand)
        await self.db.commit()

        return brand

    async def save(self, brand: Brand) -> Brand:
        """Сохранить изменения существующего бренда."""

        await self.db.commit()

        return brand

    async def delete(self, brand: Brand) -> None:
        """Удалить бренд. У его товаров бренд становится пустым."""

        await self.db.delete(brand)
        await self.db.commit()


class ProductRepository:
    """Доступ к таблице products. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_published(
        self, filters: ProductFilters, sort: str, limit: int, offset: int
    ) -> tuple[list[Product], int]:
        """Опубликованные товары под фильтры и их общее количество для пагинации."""

        conditions = build_conditions(filters)
        ordering = PRODUCT_SORTS.get(sort, PRODUCT_SORTS["popular"])

        products_stmt = (
            select(Product).where(*conditions).order_by(*ordering).limit(limit).offset(offset)
        )
        count_stmt = select(func.count()).select_from(Product).where(*conditions)

        result = await self.db.execute(products_stmt)
        products = list(result.scalars().all())

        total = await self.db.scalar(count_stmt)
        if total is None:
            total = 0

        return products, total

    async def get_published(self, slug: str) -> Product | None:
        """Опубликованный товар по slug. Черновик считается ненайденным."""

        stmt = select(Product).where(Product.slug == slug, PUBLISHED)
        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def get_published_by_id(self, product_id: int, lock: bool = False) -> Product | None:
        """Опубликованный товар по идентификатору, черновик — ненайденный. С lock — под блокировкой."""

        stmt = select(Product).where(Product.id == product_id, PUBLISHED)
        if lock:
            stmt = stmt.with_for_update()

        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def lock_published(self, product_ids: list[int]) -> list[Product]:
        """Опубликованные товары с блокировкой строк до конца транзакции. Для оформления заказа."""

        stmt = (
            select(Product)
            .where(Product.id.in_(product_ids), PUBLISHED)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def list_all(
        self,
        search: str | None,
        category_id: int | None,
        status: str | None,
        limit: int,
        offset: int,
    ) -> tuple[list[Product], int]:
        """Все товары для админки, включая черновики. search ищет по названию и артикулу."""

        conditions: list[ColumnElement[bool]] = []

        if search:
            by_name = Product.name.icontains(search, autoescape=True)
            by_sku = Product.sku.icontains(search, autoescape=True)
            conditions.append(by_name | by_sku)

        if category_id is not None:
            conditions.append(Product.category_id == category_id)

        if status:
            conditions.append(Product.status == status)

        products_stmt = (
            select(Product)
            .where(*conditions)
            .order_by(Product.sort_order, Product.name)
            .limit(limit)
            .offset(offset)
        )
        count_stmt = select(func.count()).select_from(Product).where(*conditions)

        result = await self.db.execute(products_stmt)
        products = list(result.scalars().all())

        total = await self.db.scalar(count_stmt)
        if total is None:
            total = 0

        return products, total

    async def list_by_ids(self, product_ids: list[int], lock: bool = False) -> list[Product]:
        """Товары по списку идентификаторов, включая черновики. С lock — под блокировкой строк."""

        if not product_ids:
            return []

        stmt = select(Product).where(Product.id.in_(product_ids))
        if lock:
            stmt = stmt.with_for_update().execution_options(populate_existing=True)

        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_by_id(self, product_id: int) -> Product | None:
        """Товар по идентификатору для админки, черновики тоже."""

        return await self.db.get(Product, product_id)

    async def sku_taken(self, sku: str, exclude_id: int | None = None) -> bool:
        """Занят ли артикул другим товаром."""

        stmt = select(Product.id).where(Product.sku == sku)
        if exclude_id is not None:
            stmt = stmt.where(Product.id != exclude_id)

        return await self.db.scalar(stmt) is not None

    async def unique_slug(self, wanted: str, exclude_id: int | None = None) -> str:
        """Свободный slug товара на основе wanted."""

        return await unique_slug(self.db, Product, wanted, exclude_id)

    async def price_bounds(
        self, category_id: int | None
    ) -> tuple[Decimal | None, Decimal | None]:
        """Самая низкая и самая высокая цена среди опубликованных товаров."""

        stmt = select(func.min(Product.price), func.max(Product.price)).where(PUBLISHED)
        if category_id is not None:
            stmt = stmt.where(Product.category_id == category_id)

        result = await self.db.execute(stmt)
        price_min, price_max = result.one()

        return price_min, price_max

    async def list_brands(self, category_id: int | None) -> list[Brand]:
        """Бренды, у которых есть опубликованные товары, по алфавиту."""

        brand_ids = select(Product.brand_id).where(PUBLISHED, Product.brand_id.is_not(None))
        if category_id is not None:
            brand_ids = brand_ids.where(Product.category_id == category_id)

        stmt = select(Brand).where(Brand.id.in_(brand_ids)).order_by(Brand.name)
        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def list_spec_values(self, category_id: int) -> list[tuple[int, str]]:
        """Пары (id параметра, значение) опубликованных товаров категории для фильтров."""

        stmt = (
            select(ProductSpec.attribute_id, ProductSpec.value)
            .join(Product, Product.id == ProductSpec.product_id)
            .join(Attribute, Attribute.id == ProductSpec.attribute_id)
            .where(PUBLISHED, Product.category_id == category_id, Attribute.is_filterable.is_(True))
            .distinct()
        )
        result = await self.db.execute(stmt)

        return [(attribute_id, value) for attribute_id, value in result.all()]

    async def add(self, product: Product) -> Product:
        """Сохранить новый товар и вернуть его перечитанным из базы."""

        self.db.add(product)
        await self.db.commit()

        return await self.reload(product.id)

    async def save(self, product: Product) -> Product:
        """Сохранить изменения существующего товара и вернуть его перечитанным."""

        await self.db.commit()

        return await self.reload(product.id)

    async def delete(self, product: Product) -> None:
        """Удалить товар. Фото, характеристики, отзывы и позиции корзин удаляются каскадом."""

        await self.db.delete(product)
        await self.db.commit()

    async def reload(self, product_id: int) -> Product:
        """Перечитать товар из базы после записи вместе со связями."""

        stmt = (
            select(Product)
            .where(Product.id == product_id)
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(stmt)

        return result.scalar_one()


class ReviewRepository:
    """Доступ к таблице reviews. Любая запись отзыва пересчитывает рейтинг товара."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_for_product(
        self, product_id: int, limit: int, offset: int, published_only: bool
    ) -> tuple[list[Review], int]:
        """Отзывы товара, свежие первыми, и их общее количество. Скрытые видит только админка."""

        conditions = [Review.product_id == product_id]
        if published_only:
            conditions.append(Review.is_published.is_(True))

        reviews_stmt = (
            select(Review)
            .where(*conditions)
            .order_by(Review.created_at.desc(), Review.id.desc())
            .limit(limit)
            .offset(offset)
        )
        count_stmt = select(func.count()).select_from(Review).where(*conditions)

        result = await self.db.execute(reviews_stmt)
        reviews = list(result.scalars().all())

        total = await self.db.scalar(count_stmt)
        if total is None:
            total = 0

        return reviews, total

    async def get_by_id(self, review_id: int) -> Review | None:
        """Отзыв по идентификатору или None."""

        return await self.db.get(Review, review_id)

    async def save(self, review: Review) -> Review:
        """Сохранить изменения существующего отзыва."""

        await self.db.flush()
        await self.refresh_rating(review.product_id)
        await self.db.commit()
        await self.db.refresh(review)

        return review

    async def delete(self, review: Review) -> None:
        """Удалить отзыв."""

        await self.db.delete(review)
        await self.db.flush()
        await self.refresh_rating(review.product_id)
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
