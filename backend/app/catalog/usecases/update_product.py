"""Сценарий изменения товара."""

from app.catalog.exceptions import CategoryNotFoundError, SkuAlreadyTakenError
from app.catalog.models import Availability, Product, PublicationStatus
from app.catalog.repositories.brands import BrandRepository
from app.catalog.repositories.categories import CategoryRepository
from app.catalog.repositories.products import ProductRepository
from app.catalog.schemas import ProductUpdateSchema
from app.catalog.validators import (
    apply_specs,
    availability_for_stock,
    validate_prices,
    validate_publishable,
    validate_required_fields,
    validate_specs,
)


def update_description(product: Product, payload: ProductUpdateSchema) -> None:
    """Обновить описание товара."""

    if payload.name is not None:
        product.name = payload.name
    if "short_description" in payload.model_fields_set:
        product.short_description = payload.short_description
    if "description" in payload.model_fields_set:
        product.description = payload.description
    if payload.highlights is not None:
        product.highlights = payload.highlights


def update_sale_terms(product: Product, payload: ProductUpdateSchema) -> None:
    """Обновить цену и наличие."""

    if payload.price is not None:
        product.price = payload.price
    if "old_price" in payload.model_fields_set:
        product.old_price = payload.old_price
    if "stock_quantity" in payload.model_fields_set:
        product.stock_quantity = payload.stock_quantity
    if payload.availability is not None:
        product.availability = payload.availability

    product.availability = availability_for_stock(
        product.stock_quantity, Availability(product.availability)
    )
    validate_prices(product.price, product.old_price)


class UpdateProductUseCase:
    """Редактирование товара."""

    def __init__(
        self,
        products: ProductRepository,
        categories: CategoryRepository,
        brands: BrandRepository,
    ) -> None:
        """Подключить каталог."""

        self.products = products
        self.categories = categories
        self.brands = brands

    async def execute(self, product: Product, payload: ProductUpdateSchema) -> Product:
        """Сохранить изменения товара."""

        validate_required_fields(payload)
        await self.update_category(product, payload)
        await self.update_identifiers(product, payload)
        update_description(product, payload)
        update_sale_terms(product, payload)

        if payload.is_hit is not None:
            product.is_hit = payload.is_hit
        if payload.sort_order is not None:
            product.sort_order = payload.sort_order
        if payload.status is not None:
            product.status = payload.status
        if product.status == PublicationStatus.PUBLISHED:
            validate_publishable(product)

        return await self.products.save(product)

    async def update_category(self, product: Product, payload: ProductUpdateSchema) -> None:
        """Применить характеристики категории."""

        category_id = product.category_id if payload.category_id is None else payload.category_id
        if category_id == product.category_id and payload.specs is None:
            return

        category = await self.categories.get_by_id(category_id)
        if category is None:
            raise CategoryNotFoundError(category_id)

        values = validate_specs(category, payload.specs or [])
        product.category_id = category_id
        apply_specs(product, values)

    async def update_identifiers(self, product: Product, payload: ProductUpdateSchema) -> None:
        """Обновить артикул, бренд и адрес."""

        if "sku" in payload.model_fields_set:
            if payload.sku and not await self.products.reserve_sku(
                payload.sku, exclude_id=product.id
            ):
                raise SkuAlreadyTakenError(payload.sku)
            product.sku = payload.sku
        if "brand_name" in payload.model_fields_set:
            brand = (
                await self.brands.get_or_create(payload.brand_name) if payload.brand_name else None
            )
            product.brand_id = brand.id if brand else None
        if payload.slug is not None:
            product.slug = await self.products.unique_slug(payload.slug, product.id)
