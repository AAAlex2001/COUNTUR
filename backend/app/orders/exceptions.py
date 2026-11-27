"""Ошибки бизнес-логики заказов. Роутеры переводят их в HTTP-коды."""


class EmptyCartError(ValueError):
    """Заказ нельзя оформить: корзина пуста."""


class InvalidPhoneError(ValueError):
    """Телефон покупателя не похож на номер."""


class OrderStatusError(ValueError):
    """Заказ нельзя перевести в запрошенный статус."""
