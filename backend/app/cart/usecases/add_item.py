"""Сценарий добавления товара в корзину."""

from app.cart.models import CartItem
from app.cart.repository import CartRepository
from app.cart.validators import validate_purchase
from app.catalog.exceptions import ProductNotFoundError
from app.catalog.repositories.products import ProductRepository


class AddCartItemUseCase:
    """Положить товар в корзину. Если он там уже есть, количество складывается."""

    def __init__(self, cart: CartRepository, products: ProductRepository) -> None:
        self.cart = cart
        self.products = products

    async def execute(self, user_id: int, product_id: int, quantity: int) -> list[CartItem]:
        """Вернуть корзину после добавления. Бросает ошибки товара и наличия."""

        await self.cart.lock_owner(user_id)
        product = await self.products.get_published_by_id(product_id, lock=True)
        if product is None:
            raise ProductNotFoundError(product_id)

        item = await self.cart.get_item(user_id, product_id)

        if item is None:
            validate_purchase(product, quantity)
            await self.cart.add(CartItem(user_id=user_id, product_id=product_id, quantity=quantity))
        else:
            validate_purchase(product, item.quantity + quantity)
            item.quantity += quantity
            await self.cart.save()

        return await self.cart.list_items(user_id)
