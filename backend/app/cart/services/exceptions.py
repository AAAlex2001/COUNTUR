"""Ошибки бизнес-логики корзины. Роутеры переводят их в HTTP-коды."""


class CartItemNotFoundError(LookupError):
    """Такого товара в корзине посетителя нет."""


class ProductUnavailableError(ValueError):
    """Товар сейчас нельзя купить: его нет в наличии."""


class NotEnoughStockError(ValueError):
    """На складе меньше товара, чем просит покупатель."""
