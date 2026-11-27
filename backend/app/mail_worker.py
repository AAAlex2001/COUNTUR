import asyncio
import logging
from collections.abc import Awaitable, Callable
from contextlib import suppress

from app.orders.tasks import send_next_order_mail
from app.stock_notifications.tasks import send_next_stock_notification

logger = logging.getLogger(__name__)
POLL_INTERVAL_SECONDS = 30


async def run_queue(send_next: Callable[[], Awaitable[bool]], stop: asyncio.Event) -> None:
    """Отправлять письма, пока очередь активна."""

    while not stop.is_set():
        try:
            if await send_next():
                continue
        except Exception:
            logger.exception("Ошибка почтовой задачи %s", send_next.__name__)

        with suppress(TimeoutError):
            await asyncio.wait_for(stop.wait(), timeout=POLL_INTERVAL_SECONDS)


async def run_mail_queues(stop: asyncio.Event) -> None:
    """Обслуживать очереди заказов и поступлений параллельно."""

    await asyncio.gather(
        run_queue(send_next_order_mail, stop),
        run_queue(send_next_stock_notification, stop),
    )
