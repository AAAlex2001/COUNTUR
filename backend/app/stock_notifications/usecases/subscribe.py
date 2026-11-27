from app.catalog.models import Availability
from app.catalog.services.exceptions import ProductNotFoundError
from app.catalog.services.repo import ProductRepository
from app.stock_notifications.repository import StockSubscriptionRepository


class ProductAlreadyAvailableError(ValueError):
    """Товар уже можно купить."""


class SubscribeToStockUseCase:
    """Подписка на поступление."""

    def __init__(
        self, products: ProductRepository, subscriptions: StockSubscriptionRepository
    ) -> None:
        """Подключить товары и подписки."""

        self.products = products
        self.subscriptions = subscriptions

    async def execute(self, user_id: int, product_id: int) -> None:
        """Подписаться на поступление товара."""

        product = await self.products.get_published_by_id(product_id, lock=True)
        if product is None:
            raise ProductNotFoundError(product_id)
        if product.availability == Availability.IN_STOCK:
            raise ProductAlreadyAvailableError(product_id)

        await self.subscriptions.add(user_id, product_id)
