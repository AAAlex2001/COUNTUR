import logging
from datetime import UTC, datetime, timedelta

from app.config import Settings
from app.contacts.repository import ContactsSettingsRepository
from app.mail import EmailClient, MailDeliveryError, MailNotConfiguredError
from app.mail_content import MailContent
from app.orders.letters import order_confirmation, shipment_notice
from app.orders.models import OrderMail, OrderMailKind, OrderStatus
from app.orders.repositories.mail_queue import OrderMailQueue

logger = logging.getLogger(__name__)


def should_send(job: OrderMail) -> bool:
    """Проверить актуальность письма."""

    order = job.order
    if not order.buyer.notify_orders:
        return False

    if job.kind == OrderMailKind.CONFIRMATION:
        return True

    return order.status != OrderStatus.CANCELED and order.tracking_number == job.reference


class SendOrderMailUseCase:
    """Отправка письма о заказе."""

    def __init__(
        self,
        queue: OrderMailQueue,
        contacts: ContactsSettingsRepository,
        settings: Settings,
        mail: EmailClient,
    ) -> None:
        """Подключить очередь и почту."""

        self.queue = queue
        self.contacts = contacts
        self.settings = settings
        self.mail = mail

    async def execute(self) -> bool:
        """Обработать следующее письмо."""

        job = await self.queue.next_pending()
        if job is None:
            return False

        if not should_send(job):
            await self.queue.discard(job)
            return True

        content = await self.prepare_letter(job)
        recipient = job.order.customer_email or job.order.buyer.email
        await self.deliver(job, recipient, content)
        return True

    async def prepare_letter(self, job: OrderMail) -> MailContent:
        """Подготовить письмо покупателю."""

        if job.kind == OrderMailKind.CONFIRMATION:
            contacts = await self.contacts.get()
            return order_confirmation(job.order, contacts.phone, self.settings)

        return shipment_notice(job.order, job.reference, self.settings)

    async def deliver(self, job: OrderMail, recipient: str, content: MailContent) -> None:
        """Доставить письмо покупателю."""

        try:
            await self.mail.send(recipient, content)
        except (MailDeliveryError, MailNotConfiguredError):
            logger.warning("Отложена отправка письма %s по заказу %s", job.kind, job.order_id)
            job.next_attempt_at = datetime.now(UTC) + timedelta(minutes=5)
            return

        job.sent_at = datetime.now(UTC)
