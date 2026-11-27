"""Списание и возврат остатков товаров с количественным учётом."""

from app.catalog.models import Availability, Product


def write_off_stock(product: Product, quantity: int) -> None:
    """Списать проданное количество. Если остаток кончился, товар становится «нет в наличии»."""

    if product.stock_quantity is None:
        return

    product.stock_quantity -= quantity

    if product.stock_quantity == 0:
        product.availability = Availability.OUT_OF_STOCK


def restore_stock(product: Product, quantity: int) -> None:
    """Вернуть количество на склад. Товар, закончившийся из-за заказа, снова в наличии."""

    if product.stock_quantity is None:
        return

    product.stock_quantity += quantity

    if product.availability == Availability.OUT_OF_STOCK:
        product.availability = Availability.IN_STOCK
