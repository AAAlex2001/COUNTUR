from dataclasses import dataclass, field
from decimal import Decimal

from sqlalchemy import ColumnElement, and_, or_

from app.catalog.models import (
    Availability,
    Brand,
    Category,
    Product,
    ProductSpec,
    PublicationStatus,
)

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

    conditions: list[ColumnElement[bool]] = [Product.status == PublicationStatus.PUBLISHED]

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


@dataclass(frozen=True)
class AdminProductFilters:
    """Фильтры администратора каталога."""

    search: str | None
    category_id: int | None
    status: str | None

    def conditions(self) -> list[ColumnElement[bool]]:
        """Отобрать товары для админки."""

        conditions = []
        if self.search:
            by_name = Product.name.icontains(self.search, autoescape=True)
            by_sku = Product.sku.icontains(self.search, autoescape=True)
            conditions.append(by_name | by_sku)
        if self.category_id is not None:
            conditions.append(Product.category_id == self.category_id)
        if self.status:
            conditions.append(Product.status == self.status)
        return conditions
