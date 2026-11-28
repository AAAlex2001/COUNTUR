import logging
from threading import Event
from types import FrameType
from traceback import format_tb

from requests import RequestException
from telebot import TeleBot
from telebot.apihelper import ApiException
from telebot.types import Update

logger = logging.getLogger(__name__)
RETRY_SECONDS = 5


class TelegramPolling:
    """Приём сообщений Telegram."""

    def __init__(self, bot: TeleBot) -> None:
        """Подключить бота."""

        self.bot = bot
        self.stopped = Event()
        self.offset = 0

    def stop(self, signum: int, frame: FrameType | None) -> None:
        """Остановить приём обращений."""

        self.stopped.set()

    def run(self) -> None:
        """Принимать сообщения до остановки."""

        self.disconnect_webhook()
        while not self.stopped.is_set():
            try:
                self.receive()
            except (RequestException, ApiException) as error:
                self.wait_for_connection(error)

    def disconnect_webhook(self) -> None:
        """Отключить вебхук Telegram."""

        while not self.stopped.is_set():
            try:
                self.bot.delete_webhook(drop_pending_updates=False)
                return
            except (RequestException, ApiException) as error:
                self.wait_for_connection(error)

    def receive(self) -> None:
        """Обработать сообщения по порядку."""

        updates = self.bot.get_updates(
            offset=self.offset,
            allowed_updates=["message", "callback_query"],
            timeout=25,
            long_polling_timeout=20,
        )
        for update in updates:
            if self.stopped.is_set():
                return

            try:
                self.process_update(update)
            except Exception as error:
                stack_trace = "".join(format_tb(error.__traceback__))
                logger.error(
                    "Не удалось обработать событие %s (%s)\n%s",
                    update.update_id,
                    type(error).__name__,
                    stack_trace,
                )
                self.stopped.wait(RETRY_SECONDS)
                return

            self.offset = update.update_id + 1

    def process_update(self, update: Update) -> None:
        """Обработать одно событие Telegram."""

        self.bot.process_new_updates([update])

    def wait_for_connection(self, error: Exception) -> None:
        """Подождать восстановления Telegram."""

        logger.warning(
            "Telegram недоступен (%s). Повтор через %s с.", type(error).__name__, RETRY_SECONDS
        )
        self.stopped.wait(RETRY_SECONDS)
