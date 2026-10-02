"""Сценарий добавления товара в корзину."""

from app.cart.models import CartItem
from app.cart.services.repo import CartRepository
from app.cart.services.validators import validate_purchase
from app.catalog.services.exceptions import ProductNotFoundError
from app.catalog.services.repo import ProductRepository


class AddCartItemUseCase:
    """Положить товар в корзину. Если он там уже есть, количество складывается."""

    def __init__(self, cart: CartRepository, products: ProductRepository) -> None:
        self.cart = cart
        self.products = products

    async def execute(self, visitor_id: str, product_id: int, quantity: int) -> list[CartItem]:
        """Вернуть корзину после добавления. Бросает ошибки товара и наличия."""

        product = await self.products.get_published_by_id(product_id)
        if product is None:
            raise ProductNotFoundError(product_id)

        item = await self.cart.get_item(visitor_id, product_id)

        if item is None:
            validate_purchase(product, quantity)
            await self.cart.add(
                CartItem(visitor_id=visitor_id, product_id=product_id, quantity=quantity)
            )
        else:
            validate_purchase(product, item.quantity + quantity)
            item.quantity += quantity
            await self.cart.save()

        return await self.cart.list_items(visitor_id)
