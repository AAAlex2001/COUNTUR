"""Сценарий изменения количества товара в корзине."""

from app.cart.exceptions import CartItemNotFoundError
from app.cart.models import CartItem
from app.cart.repository import CartRepository
from app.cart.validators import validate_purchase


class SetCartItemQuantityUseCase:
    """Задать новое количество товара, который уже лежит в корзине."""

    def __init__(self, cart: CartRepository) -> None:
        self.cart = cart

    async def execute(self, user_id: int, product_id: int, quantity: int) -> list[CartItem]:
        """Вернуть корзину после изменения. Бросает CartItemNotFoundError и ошибки наличия."""

        await self.cart.lock_owner(user_id)
        item = await self.cart.get_item(user_id, product_id)
        if item is None:
            raise CartItemNotFoundError(product_id)

        validate_purchase(item.product, quantity)

        item.quantity = quantity
        await self.cart.save()

        return await self.cart.list_items(user_id)
