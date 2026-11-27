from datetime import datetime
from decimal import Decimal
from enum import StrEnum

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.catalog.models import Product
from app.database import Base
from app.users.models import User


class OrderStatus(StrEnum):
    """Статусы выполнения заказа."""

    NEW = "new"
    CONFIRMED = "confirmed"
    AWAITING_PAYMENT = "awaiting_payment"
    PAID = "paid"
    SHIPPED = "shipped"
    COMPLETED = "completed"
    CANCELED = "canceled"


class PaymentStatus(StrEnum):
    """Статусы оплаты. Хранятся отдельно от статуса выполнения заказа."""

    UNPAID = "unpaid"
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class DeliveryMethod(StrEnum):
    """Способ получения заказа."""

    COURIER = "courier"
    PICKUP_POINT = "pickup_point"
    PICKUP = "pickup"


class OrderMailKind(StrEnum):
    """Виды писем о заказе."""

    CONFIRMATION = "confirmation"
    SHIPMENT = "shipment"


class Order(Base):
    """Заказ покупателя. total — сумма позиций на момент оформления."""

    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    buyer: Mapped[User] = relationship(lazy="raise")

    customer_name: Mapped[str] = mapped_column(String(150))
    customer_phone: Mapped[str] = mapped_column(String(32))
    customer_email: Mapped[str | None] = mapped_column(String(255))

    delivery_method: Mapped[str] = mapped_column(String(32))
    delivery_address: Mapped[str | None] = mapped_column(String(500))
    tracking_number: Mapped[str | None] = mapped_column(String(100))
    payment_method: Mapped[str | None] = mapped_column(String(20))
    comment: Mapped[str | None] = mapped_column(String(1000))

    status: Mapped[str] = mapped_column(String(32), default=OrderStatus.NEW, index=True)
    payment_status: Mapped[str] = mapped_column(String(32), default=PaymentStatus.UNPAID)

    total: Mapped[Decimal] = mapped_column(Numeric(12, 2))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    items: Mapped[list["OrderItem"]] = relationship(
        back_populates="order",
        lazy="selectin",
        order_by="OrderItem.id",
        cascade="all, delete-orphan",
    )


class OrderMail(Base):
    """Письмо, поставленное в очередь вместе с сохранением заказа."""

    __tablename__ = "order_mail"

    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), primary_key=True
    )
    order: Mapped[Order] = relationship(lazy="raise")
    kind: Mapped[str] = mapped_column(String(20), primary_key=True)
    reference: Mapped[str] = mapped_column(String(100), primary_key=True)
    next_attempt_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    __table_args__ = (
        Index("ix_order_mail_pending", "next_attempt_at", postgresql_where=text("sent_at IS NULL")),
    )


class OrderItem(Base):
    """Позиция заказа. Название, артикул и цена копируются из товара при оформлении."""

    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), index=True)
    product_id: Mapped[int | None] = mapped_column(
        ForeignKey("products.id", ondelete="SET NULL"), index=True
    )

    product_name: Mapped[str] = mapped_column(String(255))
    product_sku: Mapped[str | None] = mapped_column(String(64))
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    quantity: Mapped[int] = mapped_column(Integer)

    order: Mapped["Order"] = relationship(back_populates="items")
    product: Mapped[Product | None] = relationship(lazy="selectin")

    __table_args__ = (CheckConstraint("quantity > 0", name="ck_order_items_quantity"),)

    @property
    def subtotal(self) -> Decimal:
        """Стоимость позиции: цена на момент заказа × количество."""

        return self.price * self.quantity

    @property
    def image_url(self) -> str | None:
        """Главное фото товара, если товар ещё есть в каталоге."""

        return self.product.image_url if self.product is not None else None
