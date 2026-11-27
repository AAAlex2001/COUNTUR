from app.config import get_settings
from app.database import SessionLocal
from app.mail import EmailClient
from app.stock_notifications.repository import StockSubscriptionRepository
from app.stock_notifications.usecases.send_stock_notification import SendStockNotificationUseCase


async def send_next_stock_notification() -> bool:
    """Обработать одно письмо о поступлении."""

    settings = get_settings()

    async with SessionLocal.begin() as db:
        usecase = SendStockNotificationUseCase(
            subscriptions=StockSubscriptionRepository(db),
            mail=EmailClient(settings),
            site_url=settings.site_url,
        )
        return await usecase.execute()
