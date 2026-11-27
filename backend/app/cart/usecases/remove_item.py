"""Сценарий удаления товара из корзины."""

from app.cart.exceptions import CartItemNotFoundError
from app.cart.models import CartItem
from app.cart.repository import CartRepository


class RemoveCartItemUseCase:
    """Убрать товар из корзины покупателя целиком, сколько бы штук ни лежало."""

    def __init__(self, cart: CartRepository) -> None:
        self.cart = cart

    async def execute(self, user_id: int, product_id: int) -> list[CartItem]:
        """Вернуть корзину после удаления. Бросает CartItemNotFoundError."""

        await self.cart.lock_owner(user_id)
        item = await self.cart.get_item(user_id, product_id)
        if item is None:
            raise CartItemNotFoundError(product_id)

        await self.cart.remove(item)

        return await self.cart.list_items(user_id)
