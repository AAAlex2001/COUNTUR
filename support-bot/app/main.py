import logging
import signal
from types import FrameType

from sqlalchemy.orm import sessionmaker
from telebot import TeleBot
from telebot.types import Update

from app.config import get_bot_settings
from app.database import create_bot_engine
from app.dependencies import get_handlers


class PollingBot(TeleBot):
    """Обрабатывает нажатия кнопок и текст в порядке получения от Telegram."""

    def process_new_updates(self, updates: list[Update]) -> None:
        """Передаёт события по одному, чтобы библиотека не перегруппировала их по типу."""

        for update in updates:
            super().process_new_updates([update])


def main() -> None:
    """Подключает хранилище, регистрирует обработчики и запускает long polling."""

    logging.basicConfig(level=logging.INFO)
    settings = get_bot_settings()
    engine = create_bot_engine(settings.database_url)
    bot = PollingBot(settings.telegram_bot_token.get_secret_value(), threaded=False)
    get_handlers(bot, settings.admin_chat_id, sessionmaker(engine)).register()

    def stop_polling(signum: int, frame: FrameType | None) -> None:
        """Даёт текущему обработчику завершиться при остановке контейнера."""

        bot.stop_polling()

    signal.signal(signal.SIGTERM, stop_polling)
    signal.signal(signal.SIGINT, stop_polling)
    try:
        bot.delete_webhook(drop_pending_updates=False)
        bot.infinity_polling(allowed_updates=["message", "callback_query"], skip_pending=False)
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
