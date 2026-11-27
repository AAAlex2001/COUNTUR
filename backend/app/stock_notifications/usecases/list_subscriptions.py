from app.stock_notifications.repository import StockSubscriptionRepository


class ListStockSubscriptionsUseCase:
    """Подписки покупателя."""

    def __init__(self, subscriptions: StockSubscriptionRepository) -> None:
        """Подключить подписки."""

        self.subscriptions = subscriptions

    async def execute(self, user_id: int) -> list[int]:
        """Получить товары с подпиской."""

        return await self.subscriptions.list_product_ids(user_id)
