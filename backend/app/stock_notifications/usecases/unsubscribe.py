from app.stock_notifications.repository import StockSubscriptionRepository


class UnsubscribeFromStockUseCase:
    """Отмена подписки."""

    def __init__(self, subscriptions: StockSubscriptionRepository) -> None:
        """Подключить подписки."""

        self.subscriptions = subscriptions

    async def execute(self, user_id: int, product_id: int) -> None:
        """Отменить подписку покупателя."""

        await self.subscriptions.remove(user_id, product_id)
