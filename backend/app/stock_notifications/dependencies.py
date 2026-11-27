from app.catalog.repositories.products import ProductRepository
from app.database import DatabaseSession
from app.stock_notifications.repository import StockSubscriptionRepository
from app.stock_notifications.usecases.list_subscriptions import ListStockSubscriptionsUseCase
from app.stock_notifications.usecases.subscribe import SubscribeToStockUseCase
from app.stock_notifications.usecases.unsubscribe import UnsubscribeFromStockUseCase


def get_subscribe_usecase(db: DatabaseSession) -> SubscribeToStockUseCase:
    """Подготовить подписку на поступление."""

    return SubscribeToStockUseCase(
        products=ProductRepository(db),
        subscriptions=StockSubscriptionRepository(db),
    )


def get_unsubscribe_usecase(db: DatabaseSession) -> UnsubscribeFromStockUseCase:
    """Подготовить отмену подписки."""

    return UnsubscribeFromStockUseCase(subscriptions=StockSubscriptionRepository(db))


def get_list_subscriptions_usecase(db: DatabaseSession) -> ListStockSubscriptionsUseCase:
    """Подготовить список подписок."""

    return ListStockSubscriptionsUseCase(subscriptions=StockSubscriptionRepository(db))
