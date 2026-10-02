"""Тесты правил каталога без БД."""

from decimal import Decimal

import pytest

from app.catalog.models import Attribute, Category, Product, ProductImage, ProductSpec
from app.catalog.schemas import SpecInSchema
from app.catalog.services.exceptions import InvalidFilterError, InvalidProductError
from app.catalog.services.validators import (
    apply_specs,
    natural_key,
    parse_spec_filters,
    validate_price_range,
    validate_prices,
    validate_publishable,
    validate_specs,
)
from tests.fakes import make_product


def make_category() -> Category:
    return Category(
        id=1,
        slug="processors",
        name="Процессоры",
        attributes=[
            Attribute(id=10, group="Основные", name="Сокет", sort_order=1),
            Attribute(id=11, group="Основные", name="Количество ядер", sort_order=2),
        ],
    )


def test_parse_spec_filters_groups_values_by_attribute() -> None:
    filters = parse_spec_filters(["10:LGA 1700", "10:AM5", "11:24", "12:16:9"])

    assert filters == {10: ["LGA 1700", "AM5"], 11: ["24"], 12: ["16:9"]}


@pytest.mark.parametrize("raw", ["LGA 1700", "socket:AM5", "10:", ":AM5", "-1:AM5"])
def test_parse_spec_filters_rejects_malformed_filter(raw: str) -> None:
    with pytest.raises(InvalidFilterError):
        parse_spec_filters([raw])


def test_validate_price_range() -> None:
    validate_price_range(None, Decimal("100"))
    validate_price_range(Decimal("100"), Decimal("100"))

    with pytest.raises(InvalidFilterError):
        validate_price_range(Decimal("200"), Decimal("100"))


def test_validate_prices_requires_old_price_above_price() -> None:
    validate_prices(Decimal("100"), None)
    validate_prices(Decimal("100"), Decimal("120"))

    with pytest.raises(InvalidProductError):
        validate_prices(Decimal("100"), Decimal("100"))


def test_validate_specs_returns_values_by_attribute() -> None:
    specs = [
        SpecInSchema(attribute_id=10, value=" LGA 1700 "),
        SpecInSchema(attribute_id=11, value="24"),
    ]

    assert validate_specs(make_category(), specs) == {10: "LGA 1700", 11: "24"}


def test_validate_specs_rejects_foreign_and_duplicate_attributes() -> None:
    category = make_category()

    with pytest.raises(InvalidProductError):
        validate_specs(category, [SpecInSchema(attribute_id=99, value="x")])

    with pytest.raises(InvalidProductError):
        validate_specs(
            category,
            [
                SpecInSchema(attribute_id=10, value="AM5"),
                SpecInSchema(attribute_id=10, value="AM4"),
            ],
        )


def test_apply_specs_updates_existing_rows_in_place() -> None:
    socket = ProductSpec(attribute_id=10, value="AM4")
    cores = ProductSpec(attribute_id=11, value="6")
    product = make_product(1)
    product.specs = [socket, cores]

    apply_specs(product, {10: "AM5", 12: "DDR5"})

    saved = [(spec.attribute_id, spec.value) for spec in product.specs]

    assert saved == [(10, "AM5"), (12, "DDR5")]
    assert product.specs[0] is socket


def test_validate_publishable_requires_image_and_specs() -> None:
    product = make_product(1)

    with pytest.raises(InvalidProductError):
        validate_publishable(product)

    product.images = [ProductImage(path="products/a.jpg")]

    with pytest.raises(InvalidProductError):
        validate_publishable(product)

    product.specs = [ProductSpec(attribute_id=10, value="AM5")]

    validate_publishable(product)


def test_natural_key_sorts_numbers_by_value() -> None:
    values = ["16 ГБ", "8 ГБ", "32 ГБ", "DDR5", "ddr4"]

    assert sorted(values, key=natural_key) == ["8 ГБ", "16 ГБ", "32 ГБ", "ddr4", "DDR5"]


def test_product_discount_and_main_image() -> None:
    product = Product(price=Decimal("42990"), old_price=Decimal("49990"))
    product.images = [
        ProductImage(path="products/main.jpg"),
        ProductImage(path="products/side.jpg"),
    ]

    assert product.discount_percent == 14
    assert product.image_url == "/media/products/main.jpg"

    plain = Product(price=Decimal("100"), old_price=None)

    assert plain.discount_percent is None
    assert plain.image_url is None
