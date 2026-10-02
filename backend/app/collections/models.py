from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.catalog.models import Product, PublicationStatus
from app.database import Base

collection_products = Table(
    "collection_products",
    Base.metadata,
    Column("collection_id", ForeignKey("collections.id", ondelete="CASCADE"), primary_key=True),
    Column("product_id", ForeignKey("products.id", ondelete="CASCADE"), primary_key=True),
)


class Collection(Base):
    """Подборка товаров, которую составляет администратор."""

    __tablename__ = "collections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    slug: Mapped[str] = mapped_column(String(150), unique=True)
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[str | None] = mapped_column(String(300))

    show_on_home: Mapped[bool] = mapped_column(Boolean, default=True)
    show_in_catalog: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    products: Mapped[list[Product]] = relationship(
        secondary=collection_products,
        lazy="selectin",
        order_by=(Product.sort_order, Product.name),
    )

    @property
    def published_products(self) -> list[Product]:
        """Товары подборки, которые видны на сайте. Черновики в подборке не показываются."""

        return [
            product for product in self.products if product.status == PublicationStatus.PUBLISHED
        ]

    @property
    def product_ids(self) -> list[int]:
        """Идентификаторы всех товаров подборки, включая черновики."""

        return [product.id for product in self.products]
