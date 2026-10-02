from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.catalog.models import Product
from app.database import Base


class CartItem(Base):
    """Позиция корзины посетителя: товар и его количество."""

    __tablename__ = "cart_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    visitor_id: Mapped[str] = mapped_column(String(36), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    quantity: Mapped[int] = mapped_column(Integer)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    product: Mapped[Product] = relationship(lazy="selectin")

    __table_args__ = (
        UniqueConstraint("visitor_id", "product_id", name="uq_cart_items_visitor_product"),
        CheckConstraint("quantity > 0", name="ck_cart_items_quantity"),
    )
