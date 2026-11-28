"""Сценарий создания товара."""

from app.catalog.exceptions import CategoryNotFoundError, SkuAlreadyTakenError
from app.catalog.models import Product, ProductSpec, PublicationStatus
from app.catalog.repositories.brands import BrandRepository
from app.catalog.repositories.categories import CategoryRepository
from app.catalog.repositories.products import ProductRepository
from app.catalog.schemas import ProductCreateSchema
from app.catalog.validators import availability_for_stock, validate_prices, validate_specs
from app.slugs import make_slug


class CreateProductUseCase:
    """Создать товар черновиком. Публикация — отдельным изменением статуса."""

    def __init__(
        self,
        products: ProductRepository,
        categories: CategoryRepository,
        brands: BrandRepository,
    ) -> None:
        self.products = products
        self.categories = categories
        self.brands = brands

    async def execute(self, payload: ProductCreateSchema) -> Product:
        """Вернуть сохранённый товар. Новый бренд создаётся по названию. Бросает ошибки категории,
        артикула и данных."""

        category = await self.categories.get_by_id(payload.category_id)
        if category is None:
            raise CategoryNotFoundError(payload.category_id)

        validate_prices(payload.price, payload.old_price)
        spec_values = validate_specs(category, payload.specs)

        if payload.sku and not await self.products.reserve_sku(payload.sku):
            raise SkuAlreadyTakenError(payload.sku)

        brand = await self.brands.get_or_create(payload.brand_name) if payload.brand_name else None
        slug = await self.products.unique_slug(payload.slug or make_slug(payload.name))

        product = Product(
            slug=slug,
            name=payload.name,
            sku=payload.sku,
            category_id=payload.category_id,
            brand_id=brand.id if brand else None,
            short_description=payload.short_description,
            description=payload.description,
            highlights=payload.highlights,
            price=payload.price,
            old_price=payload.old_price,
            stock_quantity=payload.stock_quantity,
            availability=availability_for_stock(payload.stock_quantity, payload.availability),
            status=PublicationStatus.DRAFT,
            is_hit=payload.is_hit,
            sort_order=payload.sort_order,
            specs=[
                ProductSpec(attribute_id=attribute_id, value=value)
                for attribute_id, value in spec_values.items()
            ],
        )

        return await self.products.add(product)
