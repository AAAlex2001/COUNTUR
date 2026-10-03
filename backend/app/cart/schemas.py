from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.cart.models import CartItem
from app.cart.services.validators import MAX_QUANTITY
from app.catalog.models import Availability
from app.catalog.schemas import BrandSchema


class CartItemAddSchema(BaseModel):
    """Добавление товара в корзину."""

    product_id: int = Field(..., description="ID товара")
    quantity: int = Field(1, ge=1, le=MAX_QUANTITY, description="Сколько штук добавить")


class CartItemUpdateSchema(BaseModel):
    """Новое количество товара в корзине."""

    quantity: int = Field(..., ge=1, le=MAX_QUANTITY, description="Сколько штук должно стать")


class CartProductSchema(BaseModel):
    """Товар в строке корзины."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID товара")
    slug: str = Field(..., description="Адрес страницы товара")
    name: str = Field(..., description="Название")
    brand: BrandSchema | None = Field(None, description="Производитель")
    highlights: list[str] = Field(..., description="Ключевые характеристики")
    price: Decimal = Field(..., description="Текущая цена")
    old_price: Decimal | None = Field(None, description="Цена до скидки")
    availability: Availability = Field(..., description="Наличие")
    image_url: str | None = Field(None, description="Главное фото")


class CartItemSchema(BaseModel):
    """Строка корзины."""

    product: CartProductSchema
    quantity: int = Field(..., description="Количество")
    subtotal: Decimal = Field(..., description="Стоимость строки")


class CartPageSchema(BaseModel):
    """Страница корзины покупателя в админке."""

    items: list[CartItemSchema]
    total: int = Field(..., description="Сколько всего позиций в корзине")


class CartSchema(BaseModel):
    """Корзина целиком: состав и итоговая стоимость."""

    items: list[CartItemSchema]
    total_quantity: int = Field(..., description="Сколько всего штук")
    total: Decimal = Field(..., description="Итоговая стоимость")


def build_cart_rows(items: list[CartItem]) -> list[CartItemSchema]:
    """Строки корзины с подытогами."""

    return [
        CartItemSchema(
            product=CartProductSchema.model_validate(item.product),
            quantity=item.quantity,
            subtotal=item.product.price * item.quantity,
        )
        for item in items
    ]


def build_cart_schema(items: list[CartItem]) -> CartSchema:
    """Собрать корзину для ответа: строки с подытогами и общий итог."""

    rows = build_cart_rows(items)

    return CartSchema(
        items=rows,
        total_quantity=sum(row.quantity for row in rows),
        total=sum((row.subtotal for row in rows), Decimal("0")),
    )
