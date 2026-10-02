from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, status

from app.admin.dependencies import require_admin
from app.catalog.dependencies import (
    get_add_image_usecase,
    get_attribute_by_id,
    get_brand_by_id,
    get_brand_repository,
    get_category_by_id,
    get_category_repository,
    get_create_attribute_usecase,
    get_create_brand_usecase,
    get_create_category_usecase,
    get_create_product_usecase,
    get_delete_category_usecase,
    get_delete_product_usecase,
    get_product_by_id,
    get_product_repository,
    get_remove_image_usecase,
    get_reorder_images_usecase,
    get_review_by_id,
    get_review_repository,
    get_update_attribute_usecase,
    get_update_brand_usecase,
    get_update_category_usecase,
    get_update_product_usecase,
    get_update_review_usecase,
)
from app.catalog.models import Attribute, Brand, Category, Product, PublicationStatus, Review
from app.catalog.schemas import (
    AttributeCreateSchema,
    AttributeUpdateSchema,
    BrandCreateSchema,
    BrandSchema,
    BrandUpdateSchema,
    CategoryAdminSchema,
    CategoryCreateSchema,
    CategoryUpdateSchema,
    ImageOrderSchema,
    ProductAdminListSchema,
    ProductAdminSchema,
    ProductCreateSchema,
    ProductUpdateSchema,
    ReviewAdminListSchema,
    ReviewAdminSchema,
    ReviewUpdateSchema,
)
from app.catalog.services.exceptions import (
    AttributeAlreadyExistsError,
    BrandNotFoundError,
    CategoryInUseError,
    CategoryNotFoundError,
    ImageNotFoundError,
    InvalidProductError,
    SkuAlreadyTakenError,
)
from app.catalog.services.repo import (
    BrandRepository,
    CategoryRepository,
    ProductRepository,
    ReviewRepository,
)
from app.catalog.services.usecases.create_product import CreateProductUseCase
from app.catalog.services.usecases.delete_product import DeleteProductUseCase
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
from app.catalog.services.usecases.manage_reviews import UpdateReviewUseCase
from app.catalog.services.usecases.update_product import UpdateProductUseCase
from app.uploads import UploadError

router = APIRouter(
    prefix="/admin",
    tags=["admin: catalog"],
    dependencies=[Depends(require_admin)],
)


@router.get("/categories")
async def list_categories(
    categories: CategoryRepository = Depends(get_category_repository),
) -> list[CategoryAdminSchema]:
    """Все категории вместе с параметрами."""

    items = await categories.list_all()

    return [CategoryAdminSchema.model_validate(item) for item in items]


@router.post("/categories", status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreateSchema,
    usecase: CreateCategoryUseCase = Depends(get_create_category_usecase),
) -> CategoryAdminSchema:
    """Создание категории."""

    category = await usecase.execute(payload)

    return CategoryAdminSchema.model_validate(category)


@router.patch("/categories/{category_id}")
async def update_category(
    payload: CategoryUpdateSchema,
    category: Category = Depends(get_category_by_id),
    usecase: UpdateCategoryUseCase = Depends(get_update_category_usecase),
) -> CategoryAdminSchema:
    """Частичное обновление категории."""

    updated = await usecase.execute(category, payload)

    return CategoryAdminSchema.model_validate(updated)


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category: Category = Depends(get_category_by_id),
    usecase: DeleteCategoryUseCase = Depends(get_delete_category_usecase),
) -> None:
    """Удаление категории. Категорию с товарами удалить нельзя."""

    try:
        await usecase.execute(category)
    except CategoryInUseError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="В категории есть товары. Сначала перенесите или удалите их",
        ) from error


@router.post("/categories/{category_id}/attributes", status_code=status.HTTP_201_CREATED)
async def create_attribute(
    payload: AttributeCreateSchema,
    category: Category = Depends(get_category_by_id),
    usecase: CreateAttributeUseCase = Depends(get_create_attribute_usecase),
) -> CategoryAdminSchema:
    """Добавление параметра в набор характеристик категории."""

    try:
        updated = await usecase.execute(category, payload)
    except AttributeAlreadyExistsError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="В категории уже есть параметр с таким названием",
        ) from error

    return CategoryAdminSchema.model_validate(updated)


@router.patch("/attributes/{attribute_id}")
async def update_attribute(
    payload: AttributeUpdateSchema,
    attribute: Attribute = Depends(get_attribute_by_id),
    usecase: UpdateAttributeUseCase = Depends(get_update_attribute_usecase),
) -> CategoryAdminSchema:
    """Частичное обновление параметра категории."""

    try:
        category = await usecase.execute(attribute, payload)
    except AttributeAlreadyExistsError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="В категории уже есть параметр с таким названием",
        ) from error

    return CategoryAdminSchema.model_validate(category)


@router.delete("/attributes/{attribute_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_attribute(
    attribute: Attribute = Depends(get_attribute_by_id),
    categories: CategoryRepository = Depends(get_category_repository),
) -> None:
    """Удаление параметра. Его значения пропадают у всех товаров категории."""

    await categories.delete_attribute(attribute)


@router.get("/brands")
async def list_brands(
    brands: BrandRepository = Depends(get_brand_repository),
) -> list[BrandSchema]:
    """Все бренды."""

    items = await brands.list_all()

    return [BrandSchema.model_validate(item) for item in items]


@router.post("/brands", status_code=status.HTTP_201_CREATED)
async def create_brand(
    payload: BrandCreateSchema,
    usecase: CreateBrandUseCase = Depends(get_create_brand_usecase),
) -> BrandSchema:
    """Создание бренда."""

    brand = await usecase.execute(payload)

    return BrandSchema.model_validate(brand)


@router.patch("/brands/{brand_id}")
async def update_brand(
    payload: BrandUpdateSchema,
    brand: Brand = Depends(get_brand_by_id),
    usecase: UpdateBrandUseCase = Depends(get_update_brand_usecase),
) -> BrandSchema:
    """Частичное обновление бренда."""

    updated = await usecase.execute(brand, payload)

    return BrandSchema.model_validate(updated)


@router.delete("/brands/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand(
    brand: Brand = Depends(get_brand_by_id),
    brands: BrandRepository = Depends(get_brand_repository),
) -> None:
    """Удаление бренда. Его товары остаются, но без бренда."""

    await brands.delete(brand)


@router.get("/products")
async def list_products(
    q: str | None = Query(None, max_length=100, description="Поиск по названию и артикулу"),
    category_id: int | None = Query(None, description="ID категории"),
    product_status: PublicationStatus | None = Query(
        None, alias="status", description="Публикация: draft, published или unpublished"
    ),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    products: ProductRepository = Depends(get_product_repository),
) -> ProductAdminListSchema:
    """Все товары, включая черновики, в порядке показа в каталоге."""

    search = q.strip() if q else None
    items, total = await products.list_all(search, category_id, product_status, limit, offset)

    return ProductAdminListSchema(
        products=[ProductAdminSchema.model_validate(item) for item in items],
        total=total,
    )


@router.post("/products", status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductCreateSchema,
    usecase: CreateProductUseCase = Depends(get_create_product_usecase),
) -> ProductAdminSchema:
    """Создание товара. Товар создаётся черновиком."""

    try:
        product = await usecase.execute(payload)
    except (CategoryNotFoundError, BrandNotFoundError) as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Категория или бренд не найдены",
        ) from error
    except SkuAlreadyTakenError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Этот артикул уже занят другим товаром",
        ) from error
    except InvalidProductError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    return ProductAdminSchema.model_validate(product)


@router.get("/products/{product_id}")
async def get_product(
    product: Product = Depends(get_product_by_id),
) -> ProductAdminSchema:
    """Товар для редактирования."""

    return ProductAdminSchema.model_validate(product)


@router.patch("/products/{product_id}")
async def update_product(
    payload: ProductUpdateSchema,
    product: Product = Depends(get_product_by_id),
    usecase: UpdateProductUseCase = Depends(get_update_product_usecase),
) -> ProductAdminSchema:
    """Частичное обновление товара. Публикация и снятие с публикации — через status."""

    try:
        updated = await usecase.execute(product, payload)
    except (CategoryNotFoundError, BrandNotFoundError) as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Категория или бренд не найдены",
        ) from error
    except SkuAlreadyTakenError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Этот артикул уже занят другим товаром",
        ) from error
    except InvalidProductError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    return ProductAdminSchema.model_validate(updated)


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product: Product = Depends(get_product_by_id),
    usecase: DeleteProductUseCase = Depends(get_delete_product_usecase),
) -> None:
    """Удаление товара вместе с фото."""

    await usecase.execute(product)


@router.post("/products/{product_id}/images", status_code=status.HTTP_201_CREATED)
async def upload_product_image(
    file: UploadFile,
    product: Product = Depends(get_product_by_id),
    usecase: AddProductImageUseCase = Depends(get_add_image_usecase),
) -> ProductAdminSchema:
    """Загрузка фото товара. Новое фото становится последним в галерее."""

    try:
        updated = await usecase.execute(product, file)
    except UploadError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    return ProductAdminSchema.model_validate(updated)


@router.put("/products/{product_id}/images/order")
async def reorder_product_images(
    payload: ImageOrderSchema,
    product: Product = Depends(get_product_by_id),
    usecase: ReorderProductImagesUseCase = Depends(get_reorder_images_usecase),
) -> ProductAdminSchema:
    """Новый порядок фото. Первое в списке становится главным."""

    try:
        updated = await usecase.execute(product, payload.image_ids)
    except InvalidProductError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    return ProductAdminSchema.model_validate(updated)


@router.delete("/products/{product_id}/images/{image_id}")
async def delete_product_image(
    image_id: int,
    product: Product = Depends(get_product_by_id),
    usecase: RemoveProductImageUseCase = Depends(get_remove_image_usecase),
) -> ProductAdminSchema:
    """Удаление фото товара."""

    try:
        updated = await usecase.execute(product, image_id)
    except ImageNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Фото не найдено",
        ) from error
    except InvalidProductError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    return ProductAdminSchema.model_validate(updated)


@router.get("/products/{product_id}/reviews")
async def list_product_reviews(
    limit: int = Query(10, ge=1, le=50),
    offset: int = Query(0, ge=0),
    product: Product = Depends(get_product_by_id),
    reviews: ReviewRepository = Depends(get_review_repository),
) -> ReviewAdminListSchema:
    """Отзывы товара, включая скрытые, свежие первыми."""

    items, total = await reviews.list_for_product(product.id, limit, offset, published_only=False)

    return ReviewAdminListSchema(
        reviews=[ReviewAdminSchema.model_validate(item) for item in items],
        total=total,
    )


@router.patch("/reviews/{review_id}")
async def update_review(
    payload: ReviewUpdateSchema,
    review: Review = Depends(get_review_by_id),
    usecase: UpdateReviewUseCase = Depends(get_update_review_usecase),
) -> ReviewAdminSchema:
    """Частичное обновление отзыва. Скрыть отзыв — is_published: false."""

    updated = await usecase.execute(review, payload)

    return ReviewAdminSchema.model_validate(updated)


@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review: Review = Depends(get_review_by_id),
    reviews: ReviewRepository = Depends(get_review_repository),
) -> None:
    """Удаление отзыва."""

    await reviews.delete(review)
