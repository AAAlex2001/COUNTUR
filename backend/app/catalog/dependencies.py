"""Каталог: репозитории, фабрики сценариев и загрузка объектов по адресу из пути."""

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import Attribute, Brand, Category, Product, Review
from app.catalog.services.repo import (
    BrandRepository,
    CategoryRepository,
    ProductRepository,
    ReviewRepository,
)
from app.catalog.services.usecases.create_product import CreateProductUseCase
from app.catalog.services.usecases.delete_product import DeleteProductUseCase
from app.catalog.services.usecases.get_catalog_filters import GetCatalogFiltersUseCase
from app.catalog.services.usecases.manage_brands import CreateBrandUseCase, UpdateBrandUseCase
from app.catalog.services.usecases.manage_categories import (
    CreateAttributeUseCase,
    CreateCategoryUseCase,
    DeleteCategoryUseCase,
    UpdateAttributeUseCase,
    UpdateCategoryUseCase,
)
from app.catalog.services.usecases.manage_images import (
    AddProductImageUseCase,
    RemoveProductImageUseCase,
    ReorderProductImagesUseCase,
)
from app.catalog.services.usecases.manage_reviews import CreateReviewUseCase, UpdateReviewUseCase
from app.catalog.services.usecases.update_product import UpdateProductUseCase
from app.database import get_session


def get_category_repository(
    session: AsyncSession = Depends(get_session),
) -> CategoryRepository:
    """Репозиторий категорий с сессией текущего запроса."""

    return CategoryRepository(session)


def get_brand_repository(
    session: AsyncSession = Depends(get_session),
) -> BrandRepository:
    """Репозиторий брендов с сессией текущего запроса."""

    return BrandRepository(session)


def get_product_repository(
    session: AsyncSession = Depends(get_session),
) -> ProductRepository:
    """Репозиторий товаров с сессией текущего запроса."""

    return ProductRepository(session)


def get_review_repository(
    session: AsyncSession = Depends(get_session),
) -> ReviewRepository:
    """Репозиторий отзывов с сессией текущего запроса."""

    return ReviewRepository(session)


async def get_published_product(
    slug: str,
    products: ProductRepository = Depends(get_product_repository),
) -> Product:
    """Опубликованный товар по slug из пути. Черновик или отсутствующий — 404."""

    product = await products.get_published(slug)
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден",
        )

    return product


async def get_product_by_id(
    product_id: int,
    products: ProductRepository = Depends(get_product_repository),
) -> Product:
    """Товар по id из пути для админки, черновики тоже. Отсутствующий — 404."""

    product = await products.get_by_id(product_id)
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден",
        )

    return product


async def get_category_by_id(
    category_id: int,
    categories: CategoryRepository = Depends(get_category_repository),
) -> Category:
    """Категория по id из пути. Отсутствующая — 404."""

    category = await categories.get_by_id(category_id)
    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Категория не найдена",
        )

    return category


async def get_attribute_by_id(
    attribute_id: int,
    categories: CategoryRepository = Depends(get_category_repository),
) -> Attribute:
    """Параметр категории по id из пути. Отсутствующий — 404."""

    attribute = await categories.get_attribute(attribute_id)
    if attribute is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Параметр не найден",
        )

    return attribute


async def get_brand_by_id(
    brand_id: int,
    brands: BrandRepository = Depends(get_brand_repository),
) -> Brand:
    """Бренд по id из пути. Отсутствующий — 404."""

    brand = await brands.get_by_id(brand_id)
    if brand is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Бренд не найден",
        )

    return brand


async def get_review_by_id(
    review_id: int,
    reviews: ReviewRepository = Depends(get_review_repository),
) -> Review:
    """Отзыв по id из пути. Отсутствующий — 404."""

    review = await reviews.get_by_id(review_id)
    if review is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Отзыв не найден",
        )

    return review


def get_catalog_filters_usecase(
    categories: CategoryRepository = Depends(get_category_repository),
    products: ProductRepository = Depends(get_product_repository),
) -> GetCatalogFiltersUseCase:
    """Сценарий сборки панели фильтров."""

    return GetCatalogFiltersUseCase(categories, products)


def get_create_product_usecase(
    products: ProductRepository = Depends(get_product_repository),
    categories: CategoryRepository = Depends(get_category_repository),
    brands: BrandRepository = Depends(get_brand_repository),
) -> CreateProductUseCase:
    """Сценарий создания товара."""

    return CreateProductUseCase(products, categories, brands)


def get_update_product_usecase(
    products: ProductRepository = Depends(get_product_repository),
    categories: CategoryRepository = Depends(get_category_repository),
    brands: BrandRepository = Depends(get_brand_repository),
) -> UpdateProductUseCase:
    """Сценарий изменения товара."""

    return UpdateProductUseCase(products, categories, brands)


def get_delete_product_usecase(
    products: ProductRepository = Depends(get_product_repository),
) -> DeleteProductUseCase:
    """Сценарий удаления товара."""

    return DeleteProductUseCase(products)


def get_add_image_usecase(
    products: ProductRepository = Depends(get_product_repository),
) -> AddProductImageUseCase:
    """Сценарий загрузки фото товара."""

    return AddProductImageUseCase(products)


def get_remove_image_usecase(
    products: ProductRepository = Depends(get_product_repository),
) -> RemoveProductImageUseCase:
    """Сценарий удаления фото товара."""

    return RemoveProductImageUseCase(products)


def get_reorder_images_usecase(
    products: ProductRepository = Depends(get_product_repository),
) -> ReorderProductImagesUseCase:
    """Сценарий изменения порядка фото."""

    return ReorderProductImagesUseCase(products)


def get_create_category_usecase(
    categories: CategoryRepository = Depends(get_category_repository),
) -> CreateCategoryUseCase:
    """Сценарий создания категории."""

    return CreateCategoryUseCase(categories)


def get_update_category_usecase(
    categories: CategoryRepository = Depends(get_category_repository),
) -> UpdateCategoryUseCase:
    """Сценарий изменения категории."""

    return UpdateCategoryUseCase(categories)


def get_delete_category_usecase(
    categories: CategoryRepository = Depends(get_category_repository),
) -> DeleteCategoryUseCase:
    """Сценарий удаления категории."""

    return DeleteCategoryUseCase(categories)


def get_create_attribute_usecase(
    categories: CategoryRepository = Depends(get_category_repository),
) -> CreateAttributeUseCase:
    """Сценарий добавления параметра категории."""

    return CreateAttributeUseCase(categories)


def get_update_attribute_usecase(
    categories: CategoryRepository = Depends(get_category_repository),
) -> UpdateAttributeUseCase:
    """Сценарий изменения параметра категории."""

    return UpdateAttributeUseCase(categories)


def get_create_brand_usecase(
    brands: BrandRepository = Depends(get_brand_repository),
) -> CreateBrandUseCase:
    """Сценарий создания бренда."""

    return CreateBrandUseCase(brands)


def get_update_brand_usecase(
    brands: BrandRepository = Depends(get_brand_repository),
) -> UpdateBrandUseCase:
    """Сценарий изменения бренда."""

    return UpdateBrandUseCase(brands)


def get_create_review_usecase(
    reviews: ReviewRepository = Depends(get_review_repository),
) -> CreateReviewUseCase:
    """Сценарий добавления отзыва."""

    return CreateReviewUseCase(reviews)


def get_update_review_usecase(
    reviews: ReviewRepository = Depends(get_review_repository),
) -> UpdateReviewUseCase:
    """Сценарий изменения отзыва."""

    return UpdateReviewUseCase(reviews)
