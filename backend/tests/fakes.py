"""Репозитории в памяти для тестов сценариев без БД."""

from decimal import Decimal

from app.cart.models import CartItem
from app.catalog.models import Availability, Product, PublicationStatus
from app.orders.models import Order


def make_product(
    product_id: int,
    price: str = "1000",
    stock_quantity: int | None = None,
    availability: str = Availability.IN_STOCK,
    status: str = PublicationStatus.PUBLISHED,
) -> Product:
    """Товар в памяти с нужными для сценариев полями."""

    return Product(
        id=product_id,
        slug=f"product-{product_id}",
        name=f"Товар {product_id}",
        sku=f"SKU-{product_id}",
        price=Decimal(price),
        stock_quantity=stock_quantity,
        availability=availability,
        status=status,
    )


class FakeProductRepository:
    """Товары в словаре по id."""

    def __init__(self, products: list[Product]) -> None:
        self.items = {product.id: product for product in products}

    async def get_published_by_id(self, product_id: int, lock: bool = False) -> Product | None:
        product = self.items.get(product_id)
        if product is None or product.status != PublicationStatus.PUBLISHED:
            return None

        return product

    async def lock_published(self, product_ids: list[int]) -> list[Product]:
        found = [await self.get_published_by_id(product_id) for product_id in product_ids]

        return [product for product in found if product is not None]

    async def list_by_ids(self, product_ids: list[int], lock: bool = False) -> list[Product]:
        return [self.items[product_id] for product_id in product_ids if product_id in self.items]


class FakeCartRepository:
    """Позиции корзин в списке. Товар к позиции подставляется из репозитория товаров."""

    def __init__(self, products: FakeProductRepository) -> None:
        self.products = products
        self.items: list[CartItem] = []

    def put(self, user_id: int, product_id: int, quantity: int) -> None:
        """Положить позицию напрямую, минуя сценарии."""

        item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        item.product = self.products.items[product_id]
        self.items.append(item)

    async def list_items(self, user_id: int, lock: bool = False) -> list[CartItem]:
        return [
            item
            for item in self.items
            if item.user_id == user_id and item.product.status == PublicationStatus.PUBLISHED
        ]

    async def get_item(self, user_id: int, product_id: int) -> CartItem | None:
        for item in self.items:
            if item.user_id == user_id and item.product_id == product_id:
                return item

        return None

    async def add(self, item: CartItem) -> None:
        item.product = self.products.items[item.product_id]
        self.items.append(item)

    async def save(self) -> None:
        return None

    async def remove(self, item: CartItem) -> None:
        self.items.remove(item)

    async def clear(self, user_id: int) -> None:
        self.items = [item for item in self.items if item.user_id != user_id]


class FakeOrderRepository:
    """Заказы в списке. create очищает корзину, как настоящий репозиторий."""

    def __init__(self, cart: FakeCartRepository) -> None:
        self.cart = cart
        self.items: list[Order] = []

    async def create(self, order: Order, user_id: int) -> Order:
        order.id = len(self.items) + 1
        self.items.append(order)
        await self.cart.clear(user_id)

        return order

    async def lock(self, order: Order) -> Order:
        return order

    async def save(self, order: Order) -> Order:
        return order
