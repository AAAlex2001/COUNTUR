from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.orders.models import DeliveryMethod, OrderStatus, PaymentStatus


class OrderCreateSchema(BaseModel):
    """Данные покупателя для оформления заказа. Состав берётся из корзины."""

    customer_name: str = Field(..., min_length=2, max_length=150, description="Имя покупателя")
    customer_phone: str = Field(..., min_length=5, max_length=32, description="Телефон")
    customer_email: EmailStr | None = Field(None, description="Email для связи")
    delivery_method: DeliveryMethod = Field(..., description="Способ получения")
    delivery_address: str | None = Field(None, max_length=500, description="Адрес доставки")
    comment: str | None = Field(None, max_length=1000, description="Комментарий к заказу")


class OrderItemSchema(BaseModel):
    """Позиция заказа."""

    model_config = ConfigDict(from_attributes=True)

    product_id: int | None = Field(None, description="ID товара. Пусто, если товар удалён")
    product_name: str = Field(..., description="Название на момент заказа")
    product_sku: str | None = Field(None, description="Артикул на момент заказа")
    image_url: str | None = Field(None, description="Главное фото товара, если он ещё в каталоге")
    price: Decimal = Field(..., description="Цена на момент заказа")
    quantity: int = Field(..., description="Количество")
    subtotal: Decimal = Field(..., description="Стоимость позиции")


class OrderSchema(BaseModel):
    """Заказ: состав, сумма, контакты и статусы."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="Номер заказа")
    status: OrderStatus = Field(..., description="Статус заказа")
    payment_status: PaymentStatus = Field(..., description="Статус оплаты")
    customer_name: str = Field(..., description="Имя покупателя")
    customer_phone: str = Field(..., description="Телефон")
    customer_email: str | None = Field(None, description="Email")
    delivery_method: DeliveryMethod = Field(..., description="Способ получения")
    delivery_address: str | None = Field(None, description="Адрес доставки")
    comment: str | None = Field(None, description="Комментарий")
    items: list[OrderItemSchema] = Field(..., description="Состав заказа")
    total: Decimal = Field(..., description="Итоговая стоимость")
    created_at: datetime = Field(..., description="Когда оформлен")


class OrderListSchema(BaseModel):
    """Страница заказов покупателя."""

    orders: list[OrderSchema]
    total: int = Field(..., description="Сколько всего заказов")


class OrderAdminSchema(OrderSchema):
    """Заказ для админки."""

    updated_at: datetime = Field(..., description="Когда изменён")


class OrderAdminListSchema(BaseModel):
    """Страница списка заказов в админке."""

    orders: list[OrderAdminSchema]
    total: int = Field(..., description="Сколько заказов подходит под фильтры")


class OrderStatusUpdateSchema(BaseModel):
    """Изменение статусов заказа. Передаются только поля, которые меняются."""

    status: OrderStatus | None = Field(None, description="Новый статус заказа")
    payment_status: PaymentStatus | None = Field(None, description="Новый статус оплаты")
