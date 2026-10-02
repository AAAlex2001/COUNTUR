"""Проверка данных каталога: фильтры, цены, характеристики, готовность к публикации."""

import re
from decimal import Decimal
from typing import Any

from app.catalog.models import Category, Product, ProductSpec
from app.catalog.schemas import SpecInSchema
from app.catalog.services.exceptions import InvalidFilterError, InvalidProductError

SPEC_FILTER_SEPARATOR = ":"

NOT_NULL_FIELDS = (
    "name",
    "slug",
    "category_id",
    "highlights",
    "price",
    "availability",
    "status",
    "is_hit",
    "sort_order",
)


def parse_spec_filters(raw_filters: list[str]) -> dict[int, list[str]]:
    """Разобрать фильтры вида «12:LGA 1700» в словарь {id параметра: значения}."""

    filters: dict[int, list[str]] = {}

    for raw in raw_filters:
        attribute_id, separator, value = raw.partition(SPEC_FILTER_SEPARATOR)

        if not separator or not attribute_id.isdigit() or not value:
            raise InvalidFilterError("Фильтр по характеристике задаётся как ID:значение")

        filters.setdefault(int(attribute_id), []).append(value)

    return filters


def validate_price_range(price_min: Decimal | None, price_max: Decimal | None) -> None:
    """Нижняя граница цены не может быть выше верхней."""

    if price_min is not None and price_max is not None and price_min > price_max:
        raise InvalidFilterError("Минимальная цена больше максимальной")


def validate_not_null(changes: dict[str, Any]) -> None:
    """Обязательные поля товара нельзя обнулить при частичном обновлении."""

    for field in NOT_NULL_FIELDS:
        if field in changes and changes[field] is None:
            raise InvalidProductError(f"Поле {field} не может быть пустым")


def validate_prices(price: Decimal, old_price: Decimal | None) -> None:
    """Цена до скидки, если задана, должна быть больше текущей."""

    if old_price is not None and old_price <= price:
        raise InvalidProductError("Цена до скидки должна быть больше текущей цены")


def validate_specs(category: Category, specs: list[SpecInSchema]) -> dict[int, str]:
    """Проверить характеристики по параметрам категории. Возвращает {id параметра: значение}."""

    allowed_ids = {attribute.id for attribute in category.attributes}
    values: dict[int, str] = {}

    for spec in specs:
        if spec.attribute_id not in allowed_ids:
            raise InvalidProductError(
                f"Параметр {spec.attribute_id} не относится к категории «{category.name}»"
            )

        if spec.attribute_id in values:
            raise InvalidProductError(f"Параметр {spec.attribute_id} указан дважды")

        values[spec.attribute_id] = spec.value.strip()

    return values


def apply_specs(product: Product, values: dict[int, str]) -> None:
    """Привести характеристики товара к новому набору, обновляя существующие записи на месте."""

    current = {spec.attribute_id: spec for spec in product.specs}
    specs: list[ProductSpec] = []

    for attribute_id, value in values.items():
        spec = current.get(attribute_id)

        if spec is None:
            spec = ProductSpec(attribute_id=attribute_id, value=value)
        else:
            spec.value = value

        specs.append(spec)

    product.specs = specs


def validate_publishable(product: Product) -> None:
    """Опубликовать можно только товар с фото и характеристиками."""

    if not product.images:
        raise InvalidProductError("Перед публикацией добавьте хотя бы одно фото")

    if not product.specs:
        raise InvalidProductError("Перед публикацией заполните характеристики")


def natural_key(value: str) -> list[int | str]:
    """Ключ сортировки, при котором «8 ГБ» идёт раньше «16 ГБ»."""

    parts = re.split(r"(\d+)", value.casefold())

    return [int(part) if part.isdigit() else part for part in parts]
