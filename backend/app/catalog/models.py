from datetime import datetime
from decimal import Decimal
from enum import StrEnum

from sqlalchemy import (
    JSON,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.config import MEDIA_URL
from app.database import Base


class Availability(StrEnum):
    """Наличие товара."""

    IN_STOCK = "in_stock"
    OUT_OF_STOCK = "out_of_stock"
    EXPECTED = "expected"


class PublicationStatus(StrEnum):
    """Публикация товара. На сайте видны только опубликованные."""

    DRAFT = "draft"
    PUBLISHED = "published"
    UNPUBLISHED = "unpublished"


class Category(Base):
    """Категория каталога: процессоры, видеокарты и так далее."""

    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    slug: Mapped[str] = mapped_column(String(100), unique=True)
    name: Mapped[str] = mapped_column(String(100))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    attributes: Mapped[list["Attribute"]] = relationship(
        back_populates="category",
        lazy="selectin",
        order_by="Attribute.sort_order, Attribute.id",
        cascade="all, delete-orphan",
    )


class Brand(Base):
    """Производитель товара."""

    __tablename__ = "brands"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    slug: Mapped[str] = mapped_column(String(100), unique=True)
    name: Mapped[str] = mapped_column(String(100))


class Attribute(Base):
    """Параметр товаров одной категории, например «Сокет» у процессоров."""

    __tablename__ = "attributes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), index=True
    )
    group: Mapped[str] = mapped_column("group_name", String(60), default="Общие")
    name: Mapped[str] = mapped_column(String(100))
    is_filterable: Mapped[bool] = mapped_column(Boolean, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    category: Mapped["Category"] = relationship(back_populates="attributes")

    __table_args__ = (
        UniqueConstraint("category_id", "name", name="uq_attributes_category_name"),
    )


class Product(Base):
    """Товар каталога. rating и reviews_count пересчитываются при изменении отзывов."""

    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    slug: Mapped[str] = mapped_column(String(255), unique=True)
    name: Mapped[str] = mapped_column(String(255))
    sku: Mapped[str | None] = mapped_column(String(64), unique=True)

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="RESTRICT"), index=True
    )
    brand_id: Mapped[int | None] = mapped_column(
        ForeignKey("brands.id", ondelete="SET NULL"), index=True
    )

    short_description: Mapped[str | None] = mapped_column(String(500))
    description: Mapped[str | None] = mapped_column(Text)
    highlights: Mapped[list[str]] = mapped_column(
        JSON().with_variant(JSONB, "postgresql"), default=list
    )

    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    old_price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    stock_quantity: Mapped[int | None] = mapped_column(Integer)
    availability: Mapped[str] = mapped_column(String(16), default=Availability.IN_STOCK)

    status: Mapped[str] = mapped_column(
        String(16), default=PublicationStatus.DRAFT, index=True
    )
    is_hit: Mapped[bool] = mapped_column(Boolean, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    rating: Mapped[Decimal | None] = mapped_column(Numeric(2, 1))
    reviews_count: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    category: Mapped["Category"] = relationship(lazy="selectin")
    brand: Mapped["Brand | None"] = relationship(lazy="selectin")
    images: Mapped[list["ProductImage"]] = relationship(
        back_populates="product",
        lazy="selectin",
        order_by="ProductImage.sort_order, ProductImage.id",
        cascade="all, delete-orphan",
    )
    specs: Mapped[list["ProductSpec"]] = relationship(
        back_populates="product",
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        CheckConstraint("price >= 0", name="ck_products_price"),
        CheckConstraint("old_price IS NULL OR old_price > price", name="ck_products_old_price"),
        CheckConstraint(
            "stock_quantity IS NULL OR stock_quantity >= 0", name="ck_products_stock_quantity"
        ),
    )

    @property
    def image_url(self) -> str | None:
        """Адрес главного фото. Главным считается первое по порядку."""

        if not self.images:
            return None

        return self.images[0].url

    @property
    def discount_percent(self) -> int | None:
        """Размер скидки в процентах или None, если скидки нет."""

        if self.old_price is None or self.old_price <= self.price:
            return None

        return round((self.old_price - self.price) / self.old_price * 100)

    @property
    def sorted_specs(self) -> list["ProductSpec"]:
        """Характеристики в порядке, заданном для параметров категории."""

        return sorted(self.specs, key=lambda spec: (spec.attribute.sort_order, spec.attribute.id))


class ProductImage(Base):
    """Фото товара. path — путь к файлу относительно каталога media."""

    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), index=True
    )
    path: Mapped[str] = mapped_column(String(500))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    product: Mapped["Product"] = relationship(back_populates="images")

    @property
    def url(self) -> str:
        """Адрес, по которому фото раздаётся как статика."""

        return f"{MEDIA_URL}/{self.path}"


class ProductSpec(Base):
    """Характеристика товара: пара «параметр — значение»."""

    __tablename__ = "product_specs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), index=True
    )
    attribute_id: Mapped[int] = mapped_column(
        ForeignKey("attributes.id", ondelete="CASCADE"), index=True
    )
    value: Mapped[str] = mapped_column(String(255))

    product: Mapped["Product"] = relationship(back_populates="specs")
    attribute: Mapped["Attribute"] = relationship(lazy="joined")

    __table_args__ = (
        UniqueConstraint("product_id", "attribute_id", name="uq_product_specs_product_attribute"),
    )

    @property
    def group(self) -> str:
        """Группа параметра, например «Частоты»."""

        return self.attribute.group

    @property
    def name(self) -> str:
        """Название параметра, например «Сокет»."""

        return self.attribute.name


class Review(Base):
    """Отзыв о товаре. Администратор правит, скрывает и удаляет отзывы."""

    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), index=True
    )
    author_name: Mapped[str] = mapped_column(String(100))
    rating: Mapped[int] = mapped_column(SmallInteger)
    text: Mapped[str] = mapped_column(Text)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    __table_args__ = (
        CheckConstraint("rating BETWEEN 1 AND 5", name="ck_reviews_rating"),
    )
