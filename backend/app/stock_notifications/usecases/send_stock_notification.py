import logging
from datetime import UTC, datetime, timedelta

from app.mail import EmailClient, MailDeliveryError, MailNotConfiguredError
from app.stock_notifications.letters import stock_notification
from app.stock_notifications.repository import StockSubscriptionRepository

logger = logging.getLogger(__name__)


class SendStockNotificationUseCase:
    """Отправить письмо о поступлении товара."""

    def __init__(
        self, subscriptions: StockSubscriptionRepository, mail: EmailClient, site_url: str
    ) -> None:
        """Запомнить подписки, почту и адрес магазина."""

        self.subscriptions = subscriptions
        self.mail = mail
        self.site_url = site_url

    async def execute(self) -> bool:
        """Обработать ближайшую подписку из очереди."""

        notice = await self.subscriptions.next_notice()
        if notice is None:
            return False

        letter = stock_notification(notice.product_name, notice.product_slug, self.site_url)
        try:
            await self.mail.send(notice.email, letter)
        except (MailDeliveryError, MailNotConfiguredError):
            notice.subscription.next_attempt_at = datetime.now(UTC) + timedelta(minutes=5)
            logger.warning(
                "Отложено письмо о поступлении товара %s", notice.subscription.product_id
            )
        else:
            await self.subscriptions.mark_notified(notice.subscription)

        return True
