"""Сценарий удаления товара из корзины."""

from app.cart.models import CartItem
from app.cart.services.exceptions import CartItemNotFoundError
from app.cart.services.repo import CartRepository


class RemoveCartItemUseCase:
    """Убрать товар из корзины посетителя целиком, сколько бы штук ни лежало."""

    def __init__(self, cart: CartRepository) -> None:
        self.cart = cart

    async def execute(self, visitor_id: str, product_id: int) -> list[CartItem]:
        """Вернуть корзину после удаления. Бросает CartItemNotFoundError."""

        item = await self.cart.get_item(visitor_id, product_id)
        if item is None:
            raise CartItemNotFoundError(product_id)

        await self.cart.remove(item)

        return await self.cart.list_items(visitor_id)
