"""Сценарий сборки боковой панели фильтров каталога."""

from dataclasses import dataclass
from decimal import Decimal

from app.catalog.models import Brand
from app.catalog.services.exceptions import CategoryNotFoundError
from app.catalog.services.repo import CategoryRepository, ProductRepository
from app.catalog.services.validators import natural_key


@dataclass(frozen=True)
class AttributeFilter:
    """Фильтр по одной характеристике и значения, которые встречаются у товаров."""

    id: int
    group: str
    name: str
    values: list[str]


@dataclass(frozen=True)
class CatalogFilters:
    """Всё, из чего фронт строит панель фильтров."""

    price_min: Decimal | None
    price_max: Decimal | None
    brands: list[Brand]
    attributes: list[AttributeFilter]


class GetCatalogFiltersUseCase:
    """Собрать фильтры каталога: цены, бренды и характеристики выбранной категории."""

    def __init__(self, categories: CategoryRepository, products: ProductRepository) -> None:
        self.categories = categories
        self.products = products

    async def execute(self, category_slug: str | None) -> CatalogFilters:
        """Вернуть фильтры для категории или для всего каталога. Бросает CategoryNotFoundError."""

        category = None
        if category_slug:
            category = await self.categories.get_by_slug(category_slug)
            if category is None:
                raise CategoryNotFoundError(category_slug)

        category_id = category.id if category else None

        price_min, price_max = await self.products.price_bounds(category_id)
        brands = await self.products.list_brands(category_id)

        attributes: list[AttributeFilter] = []

        if category is not None:
            values_by_attribute: dict[int, list[str]] = {}
            for attribute_id, value in await self.products.list_spec_values(category.id):
                values_by_attribute.setdefault(attribute_id, []).append(value)

            for attribute in category.attributes:
                values = values_by_attribute.get(attribute.id)
                if not values:
                    continue

                attributes.append(
                    AttributeFilter(
                        id=attribute.id,
                        group=attribute.group,
                        name=attribute.name,
                        values=sorted(values, key=natural_key),
                    )
                )

        return CatalogFilters(
            price_min=price_min,
            price_max=price_max,
            brands=brands,
            attributes=attributes,
        )
