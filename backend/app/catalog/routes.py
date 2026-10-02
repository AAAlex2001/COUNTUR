from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.catalog.dependencies import (
    get_catalog_filters_usecase,
    get_category_repository,
    get_product_repository,
    get_published_product,
    get_review_repository,
)
from app.catalog.models import Product
from app.catalog.schemas import (
    CatalogFiltersSchema,
    CategorySchema,
    ProductCardSchema,
    ProductListSchema,
    ProductSchema,
    ProductSort,
    ReviewListSchema,
    ReviewSchema,
)
from app.catalog.services.exceptions import CategoryNotFoundError, InvalidFilterError
from app.catalog.services.repo import (
    CategoryRepository,
    ProductFilters,
    ProductRepository,
    ReviewRepository,
)
from app.catalog.services.usecases.get_catalog_filters import GetCatalogFiltersUseCase
from app.catalog.services.validators import parse_spec_filters, validate_price_range

router = APIRouter(tags=["catalog"])


@router.get("/categories")
async def get_categories(
    categories: CategoryRepository = Depends(get_category_repository),
) -> list[CategorySchema]:
    """Категории каталога с количеством товаров в каждой."""

    items = await categories.list_with_counts()

    return [
        CategorySchema(id=category.id, slug=category.slug, name=category.name, products_count=count)
        for category, count in items
    ]


@router.get("/catalog/filters")
async def get_catalog_filters(
    category: str | None = Query(None, description="Slug категории"),
    usecase: GetCatalogFiltersUseCase = Depends(get_catalog_filters_usecase),
) -> CatalogFiltersSchema:
    """Что показать в панели фильтров: диапазон цен, бренды, характеристики категории."""

    try:
        filters = await usecase.execute(category)
    except CategoryNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Категория не найдена",
        ) from error

    return CatalogFiltersSchema.model_validate(filters)


@router.get("/products")
async def get_products(
    q: str | None = Query(None, max_length=100, description="Поиск по названию"),
    category: list[str] = Query(default_factory=list, description="Slug категорий"),
    brand: list[str] = Query(default_factory=list, description="Slug брендов"),
    in_stock: bool = Query(False, description="Только товары в наличии"),
    price_min: Decimal | None = Query(None, ge=0, description="Цена от"),
    price_max: Decimal | None = Query(None, ge=0, description="Цена до"),
    spec: list[str] = Query(
        default_factory=list, description="Фильтр по характеристике: ID параметра:значение"
    ),
    sort: ProductSort = Query("popular", description="Сортировка"),
    limit: int = Query(24, ge=1, le=100),
    offset: int = Query(0, ge=0),
    products: ProductRepository = Depends(get_product_repository),
) -> ProductListSchema:
    """Список опубликованных товаров с поиском, фильтрами и сортировкой."""

    try:
        validate_price_range(price_min, price_max)
        spec_filters = parse_spec_filters(spec)
    except InvalidFilterError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    filters = ProductFilters(
        search=q.strip() if q else None,
        category_slugs=category,
        brand_slugs=brand,
        in_stock=in_stock,
        price_min=price_min,
        price_max=price_max,
        specs=spec_filters,
    )

    items, total = await products.list_published(filters, sort, limit, offset)

    return ProductListSchema(
        products=[ProductCardSchema.model_validate(item) for item in items],
        total=total,
    )


@router.get("/products/{slug}")
async def get_product(
    product: Product = Depends(get_published_product),
) -> ProductSchema:
    """Товар целиком: фото, описание, характеристики."""

    return ProductSchema.model_validate(product)


@router.get("/products/{slug}/reviews")
async def get_product_reviews(
    limit: int = Query(10, ge=1, le=50),
    offset: int = Query(0, ge=0),
    product: Product = Depends(get_published_product),
    reviews: ReviewRepository = Depends(get_review_repository),
) -> ReviewListSchema:
    """Опубликованные отзывы товара, свежие первыми."""

    items, total = await reviews.list_published(product.id, limit, offset)

    return ReviewListSchema(
        reviews=[ReviewSchema.model_validate(item) for item in items],
        total=total,
    )
