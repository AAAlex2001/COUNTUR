from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.catalog.models import Availability, PublicationStatus

ProductSort = Literal["popular", "price_asc", "price_desc", "name_asc", "name_desc"]

SLUG_PATTERN = r"^[a-z0-9]+(?:-[a-z0-9]+)*$"


class BrandSchema(BaseModel):
    """Производитель."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID бренда")
    slug: str = Field(..., description="Адрес бренда в фильтре")
    name: str = Field(..., description="Название")


class CategoryShortSchema(BaseModel):
    """Категория внутри карточки товара."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID категории")
    slug: str = Field(..., description="Адрес категории в фильтре")
    name: str = Field(..., description="Название")


class CategorySchema(CategoryShortSchema):
    """Категория для бокового фильтра каталога."""

    products_count: int = Field(..., description="Сколько опубликованных товаров в категории")


class ImageSchema(BaseModel):
    """Фото товара."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID фото")
    url: str = Field(..., description="Адрес файла")
    sort_order: int = Field(..., description="Порядок показа, первое фото — главное")


class SpecSchema(BaseModel):
    """Характеристика товара."""

    model_config = ConfigDict(from_attributes=True)

    attribute_id: int = Field(..., description="ID параметра категории")
    group: str = Field(..., description="Группа, например «Частоты»")
    name: str = Field(..., description="Название параметра")
    value: str = Field(..., description="Значение")


class ProductCardSchema(BaseModel):
    """Товар в списке: каталог, подборки, избранное."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID товара")
    slug: str = Field(..., description="Адрес страницы товара")
    name: str = Field(..., description="Название")
    category: CategoryShortSchema
    brand: BrandSchema | None = Field(None, description="Производитель")
    highlights: list[str] = Field(..., description="Ключевые характеристики для карточки")
    price: Decimal = Field(..., description="Цена в рублях")
    old_price: Decimal | None = Field(None, description="Цена до скидки")
    discount_percent: int | None = Field(None, description="Скидка в процентах")
    availability: Availability = Field(..., description="Наличие")
    is_hit: bool = Field(..., description="Показывать метку «Хит»")
    image_url: str | None = Field(None, description="Главное фото")
    rating: Decimal | None = Field(None, description="Средняя оценка по отзывам")
    reviews_count: int = Field(..., description="Количество отзывов")


class ProductSchema(ProductCardSchema):
    """Товар целиком для страницы товара."""

    sku: str | None = Field(None, description="Артикул")
    short_description: str | None = Field(None, description="Краткое описание")
    description: str | None = Field(None, description="Полное описание")
    images: list[ImageSchema] = Field(..., description="Все фото по порядку")
    specs: list[SpecSchema] = Field(
        ..., validation_alias="sorted_specs", description="Характеристики"
    )


class ProductListSchema(BaseModel):
    """Страница каталога."""

    products: list[ProductCardSchema]
    total: int = Field(..., description="Сколько товаров подходит под фильтры")


class SitemapEntrySchema(BaseModel):
    """Запись карты сайта: адрес товара и дата последнего изменения."""

    model_config = ConfigDict(from_attributes=True)

    slug: str = Field(..., description="Адрес страницы товара")
    updated_at: datetime = Field(..., description="Когда изменён")


class ReviewSchema(BaseModel):
    """Отзыв на странице товара."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID отзыва")
    author_name: str = Field(..., description="Имя автора")
    rating: int = Field(..., description="Оценка от 1 до 5")
    text: str = Field(..., description="Текст отзыва")
    created_at: datetime = Field(..., description="Когда оставлен")


class ReviewListSchema(BaseModel):
    """Отзывы товара с общим количеством."""

    reviews: list[ReviewSchema]
    total: int = Field(..., description="Сколько отзывов опубликовано")


class AttributeFilterSchema(BaseModel):
    """Фильтр по одной характеристике со всеми значениями, которые есть в каталоге."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID параметра, подставляется в spec=ID:значение")
    group: str = Field(..., description="Группа параметра")
    name: str = Field(..., description="Название параметра")
    values: list[str] = Field(..., description="Доступные значения")


class CatalogFiltersSchema(BaseModel):
    """Что показать в боковой панели фильтров."""

    model_config = ConfigDict(from_attributes=True)

    price_min: Decimal | None = Field(None, description="Самая низкая цена")
    price_max: Decimal | None = Field(None, description="Самая высокая цена")
    brands: list[BrandSchema] = Field(..., description="Бренды, у которых есть товары")
    attributes: list[AttributeFilterSchema] = Field(
        ..., description="Фильтры по характеристикам. Пусто, пока не выбрана категория"
    )


class AttributeSchema(BaseModel):
    """Параметр категории для админки."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID параметра")
    group: str = Field(..., description="Группа")
    name: str = Field(..., description="Название")
    is_filterable: bool = Field(..., description="Показывать как фильтр в каталоге")
    sort_order: int = Field(..., description="Порядок показа")


class AttributeCreateSchema(BaseModel):
    """Новый параметр категории."""

    group: str = Field("Общие", min_length=1, max_length=60, description="Группа")
    name: str = Field(..., min_length=1, max_length=100, description="Название")
    is_filterable: bool = Field(False, description="Показывать как фильтр в каталоге")
    sort_order: int = Field(0, description="Порядок показа")


class AttributeUpdateSchema(BaseModel):
    """Изменение параметра. Передаются только поля, которые меняются."""

    group: str | None = Field(None, min_length=1, max_length=60)
    name: str | None = Field(None, min_length=1, max_length=100)
    is_filterable: bool | None = None
    sort_order: int | None = None


class CategoryAdminSchema(BaseModel):
    """Категория для админки вместе с её параметрами."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID категории")
    slug: str = Field(..., description="Адрес категории")
    name: str = Field(..., description="Название")
    sort_order: int = Field(..., description="Порядок показа")
    attributes: list[AttributeSchema] = Field(..., description="Параметры товаров категории")


class CategoryCreateSchema(BaseModel):
    """Новая категория. Без slug он составляется из названия."""

    name: str = Field(..., min_length=2, max_length=100, description="Название")
    slug: str | None = Field(None, max_length=100, pattern=SLUG_PATTERN)
    sort_order: int = Field(0, description="Порядок показа")


class CategoryUpdateSchema(BaseModel):
    """Изменение категории. Передаются только поля, которые меняются."""

    name: str | None = Field(None, min_length=2, max_length=100)
    slug: str | None = Field(None, max_length=100, pattern=SLUG_PATTERN)
    sort_order: int | None = None


class BrandCreateSchema(BaseModel):
    """Новый бренд. Без slug он составляется из названия."""

    name: str = Field(..., min_length=1, max_length=100, description="Название")
    slug: str | None = Field(None, max_length=100, pattern=SLUG_PATTERN)


class BrandUpdateSchema(BaseModel):
    """Изменение бренда. Передаются только поля, которые меняются."""

    name: str | None = Field(None, min_length=1, max_length=100)
    slug: str | None = Field(None, max_length=100, pattern=SLUG_PATTERN)


class SpecInSchema(BaseModel):
    """Значение характеристики при сохранении товара."""

    attribute_id: int = Field(..., description="ID параметра категории")
    value: str = Field(..., min_length=1, max_length=255, description="Значение")


class ProductCreateSchema(BaseModel):
    """Новый товар. Создаётся черновиком: публикация — отдельным изменением статуса."""

    name: str = Field(..., min_length=2, max_length=255, description="Название")
    slug: str | None = Field(None, max_length=255, pattern=SLUG_PATTERN)
    sku: str | None = Field(None, min_length=1, max_length=64, description="Артикул")
    category_id: int = Field(..., description="ID категории")
    brand_id: int | None = Field(None, description="ID бренда")
    short_description: str | None = Field(None, max_length=500)
    description: str | None = None
    highlights: list[str] = Field(default_factory=list, max_length=8)
    price: Decimal = Field(..., ge=0, max_digits=10, decimal_places=2, description="Цена")
    old_price: Decimal | None = Field(None, gt=0, max_digits=10, decimal_places=2)
    stock_quantity: int | None = Field(None, ge=0, description="Остаток, если ведётся учёт")
    availability: Availability = Availability.IN_STOCK
    is_hit: bool = False
    sort_order: int = Field(0, description="Порядок в каталоге: меньше — выше")
    specs: list[SpecInSchema] = Field(default_factory=list, description="Характеристики")


class ProductUpdateSchema(BaseModel):
    """Изменение товара. Передаются только меняемые поля, specs заменяет весь набор."""

    name: str | None = Field(None, min_length=2, max_length=255)
    slug: str | None = Field(None, max_length=255, pattern=SLUG_PATTERN)
    sku: str | None = Field(None, min_length=1, max_length=64)
    category_id: int | None = None
    brand_id: int | None = None
    short_description: str | None = Field(None, max_length=500)
    description: str | None = None
    highlights: list[str] | None = Field(None, max_length=8)
    price: Decimal | None = Field(None, ge=0, max_digits=10, decimal_places=2)
    old_price: Decimal | None = Field(None, gt=0, max_digits=10, decimal_places=2)
    stock_quantity: int | None = Field(None, ge=0)
    availability: Availability | None = None
    status: PublicationStatus | None = None
    is_hit: bool | None = None
    sort_order: int | None = None
    specs: list[SpecInSchema] | None = None


class ProductAdminSchema(ProductSchema):
    """Товар для админки: со служебными полями."""

    category_id: int = Field(..., description="ID категории")
    brand_id: int | None = Field(None, description="ID бренда")
    stock_quantity: int | None = Field(None, description="Остаток на складе")
    status: PublicationStatus = Field(..., description="Публикация")
    sort_order: int = Field(..., description="Порядок в каталоге")
    created_at: datetime = Field(..., description="Когда создан")
    updated_at: datetime = Field(..., description="Когда изменён")


class ProductAdminListSchema(BaseModel):
    """Страница списка товаров в админке."""

    products: list[ProductAdminSchema]
    total: int = Field(..., description="Сколько товаров подходит под фильтры")


class ImageOrderSchema(BaseModel):
    """Новый порядок фото товара. Первое в списке становится главным."""

    image_ids: list[int] = Field(..., min_length=1, description="ID всех фото товара по порядку")


class ReviewAdminSchema(ReviewSchema):
    """Отзыв для админки."""

    product_id: int = Field(..., description="ID товара")
    is_published: bool = Field(..., description="Виден ли на сайте")


class ReviewAdminListSchema(BaseModel):
    """Страница отзывов товара в админке."""

    reviews: list[ReviewAdminSchema]
    total: int = Field(..., description="Сколько всего отзывов у товара")


class ReviewUpdateSchema(BaseModel):
    """Изменение отзыва. Передаются только поля, которые меняются."""

    author_name: str | None = Field(None, min_length=1, max_length=100)
    rating: int | None = Field(None, ge=1, le=5)
    text: str | None = Field(None, min_length=1, max_length=5000)
    is_published: bool | None = None
