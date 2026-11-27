import asyncio
from unittest.mock import AsyncMock

from app import mail_worker


def test_queue_retries_after_error_and_drains_pending_mail(monkeypatch) -> None:
    async def run() -> None:
        stop = asyncio.Event()
        attempts = 0

        async def send_next() -> bool:
            nonlocal attempts
            attempts += 1
            if attempts == 1:
                raise OSError("Соединение с БД прервано")
            if attempts == 3:
                stop.set()
            return True

        await asyncio.wait_for(mail_worker.run_queue(send_next, stop), timeout=1)
        assert attempts == 3

    monkeypatch.setattr(mail_worker, "POLL_INTERVAL_SECONDS", 0)
    asyncio.run(run())


def test_stop_wakes_idle_queue_and_finishes_current_mail(monkeypatch) -> None:
    async def run() -> None:
        stop = asyncio.Event()
        started = asyncio.Event()
        released = asyncio.Event()
        stock_checked = asyncio.Event()

        async def send_order() -> bool:
            started.set()
            await released.wait()
            return True

        async def check_stock() -> bool:
            stock_checked.set()
            return False

        order = AsyncMock(side_effect=send_order)
        stock = AsyncMock(side_effect=check_stock)
        monkeypatch.setattr(mail_worker, "send_next_order_mail", order)
        monkeypatch.setattr(mail_worker, "send_next_stock_notification", stock)

        worker = asyncio.create_task(mail_worker.run_mail_queues(stop))
        await asyncio.wait_for(asyncio.gather(started.wait(), stock_checked.wait()), timeout=1)
        stop.set()
        assert not worker.done()
        released.set()
        await asyncio.wait_for(worker, timeout=1)

        order.assert_awaited_once()
        stock.assert_awaited_once()

    asyncio.run(run())
