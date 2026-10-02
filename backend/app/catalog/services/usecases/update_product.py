"""Сценарий изменения товара."""

from app.catalog.models import Product, PublicationStatus
from app.catalog.schemas import ProductUpdateSchema
from app.catalog.services.exceptions import (
    BrandNotFoundError,
    CategoryNotFoundError,
    SkuAlreadyTakenError,
)
from app.catalog.services.repo import BrandRepository, CategoryRepository, ProductRepository
from app.catalog.services.validators import (
    apply_specs,
    validate_not_null,
    validate_prices,
    validate_publishable,
    validate_specs,
)


class UpdateProductUseCase:
    """Частично обновить товар. Этим же сценарием он публикуется и снимается с публикации."""

    def __init__(
        self,
        products: ProductRepository,
        categories: CategoryRepository,
        brands: BrandRepository,
    ) -> None:
        self.products = products
        self.categories = categories
        self.brands = brands

    async def execute(self, product: Product, payload: ProductUpdateSchema) -> Product:
        """Вернуть обновлённый товар. При смене категории без specs характеристики сбрасываются."""

        changes = payload.model_dump(exclude_unset=True, exclude={"specs"})

        validate_not_null(changes)
        validate_prices(
            changes.get("price", product.price),
            changes.get("old_price", product.old_price),
        )

        category_id = changes.get("category_id", product.category_id)
        category = await self.categories.get_by_id(category_id)
        if category is None:
            raise CategoryNotFoundError(category_id)

        brand_id = changes.get("brand_id")
        if brand_id is not None and await self.brands.get_by_id(brand_id) is None:
            raise BrandNotFoundError(brand_id)

        sku = changes.get("sku")
        if sku and await self.products.sku_taken(sku, exclude_id=product.id):
            raise SkuAlreadyTakenError(sku)

        if "slug" in changes:
            changes["slug"] = await self.products.unique_slug(changes["slug"], product.id)

        specs = payload.specs
        if specs is None and category_id != product.category_id:
            specs = []

        spec_values = None if specs is None else validate_specs(category, specs)

        for field, value in changes.items():
            setattr(product, field, value)

        if spec_values is not None:
            apply_specs(product, spec_values)

        if product.status == PublicationStatus.PUBLISHED:
            validate_publishable(product)

        return await self.products.save(product)
