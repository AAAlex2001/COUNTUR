from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.catalog.schemas import SLUG_PATTERN, ProductCardSchema

Placement = Literal["home", "catalog"]


class CollectionSchema(BaseModel):
    """Подборка для сайта: только опубликованные товары."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID подборки")
    slug: str = Field(..., description="Адрес подборки")
    title: str = Field(..., description="Название")
    description: str | None = Field(None, description="Описание")
    products: list[ProductCardSchema] = Field(
        ..., validation_alias="published_products", description="Товары подборки"
    )


class CollectionAdminSchema(BaseModel):
    """Подборка для админки: со всеми товарами и настройками показа."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID подборки")
    slug: str = Field(..., description="Адрес подборки")
    title: str = Field(..., description="Название")
    description: str | None = Field(None, description="Описание")
    show_on_home: bool = Field(..., description="Показывать на главной")
    show_in_catalog: bool = Field(..., description="Показывать в каталоге")
    is_active: bool = Field(..., description="Включена ли подборка")
    sort_order: int = Field(..., description="Порядок показа")
    product_ids: list[int] = Field(..., description="ID товаров подборки")
    products: list[ProductCardSchema] = Field(..., description="Товары подборки")


class CollectionCreateSchema(BaseModel):
    """Новая подборка. Без slug он составляется из названия."""

    title: str = Field(..., min_length=2, max_length=150, description="Название")
    slug: str | None = Field(None, max_length=150, pattern=SLUG_PATTERN)
    description: str | None = Field(None, max_length=300, description="Описание")
    show_on_home: bool = Field(True, description="Показывать на главной")
    show_in_catalog: bool = Field(False, description="Показывать в каталоге")
    is_active: bool = Field(True, description="Включена ли подборка")
    sort_order: int = Field(0, description="Порядок показа")
    product_ids: list[int] = Field(default_factory=list, description="ID товаров подборки")


class CollectionUpdateSchema(BaseModel):
    """Изменение подборки. Передаются только меняемые поля, product_ids заменяет состав."""

    title: str | None = Field(None, min_length=2, max_length=150)
    slug: str | None = Field(None, max_length=150, pattern=SLUG_PATTERN)
    description: str | None = Field(None, max_length=300)
    show_on_home: bool | None = None
    show_in_catalog: bool | None = None
    is_active: bool | None = None
    sort_order: int | None = None
    product_ids: list[int] | None = None
