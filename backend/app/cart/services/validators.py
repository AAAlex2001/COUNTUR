"""Проверка покупки: можно ли положить товар в корзину и оформить в заказ."""

from app.cart.services.exceptions import NotEnoughStockError, ProductUnavailableError
from app.catalog.models import Availability, Product

MAX_QUANTITY = 99


def validate_purchase(product: Product, quantity: int) -> None:
    """Товар должен быть в наличии, а количество — не больше лимита и остатка."""

    if product.availability != Availability.IN_STOCK:
        raise ProductUnavailableError(f"Товара «{product.name}» сейчас нет в наличии")

    if quantity > MAX_QUANTITY:
        raise NotEnoughStockError(f"Можно заказать не больше {MAX_QUANTITY} шт. одного товара")

    if product.stock_quantity is not None and quantity > product.stock_quantity:
        raise NotEnoughStockError(
            f"Товара «{product.name}» осталось {product.stock_quantity} шт."
        )
