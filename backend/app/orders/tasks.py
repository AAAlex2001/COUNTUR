from app.config import get_settings
from app.contacts.repository import ContactsSettingsRepository
from app.database import SessionLocal
from app.mail import EmailClient
from app.orders.repositories.mail_queue import OrderMailQueue
from app.orders.usecases.send_order_mail import SendOrderMailUseCase


async def send_next_order_mail() -> bool:
    """Обработать одно письмо по заказу."""

    settings = get_settings()

    async with SessionLocal.begin() as db:
        usecase = SendOrderMailUseCase(
            queue=OrderMailQueue(db),
            contacts=ContactsSettingsRepository(db),
            settings=settings,
            mail=EmailClient(settings),
        )
        return await usecase.execute()
