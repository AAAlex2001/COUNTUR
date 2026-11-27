import logging
import signal

from sqlalchemy.orm import sessionmaker
from telebot import TeleBot

from app.config import BotSettings
from app.database import create_bot_engine
from app.dependencies import build_handlers
from app.polling import TelegramPolling
from app.repositories.replies import ReplyRepository


def main() -> None:
    """Запустить поддержку магазина."""

    logging.basicConfig(level=logging.INFO)
    settings = BotSettings()
    engine = create_bot_engine(settings.database_url)
    bot = TeleBot(settings.telegram_bot_token.get_secret_value(), threaded=False)
    replies = ReplyRepository(sessionmaker(engine))
    handlers = build_handlers(bot=bot, owner_chat_id=settings.admin_chat_id, replies=replies)
    handlers.register()

    polling = TelegramPolling(bot)
    signal.signal(signal.SIGTERM, polling.stop)
    signal.signal(signal.SIGINT, polling.stop)
    try:
        polling.run()
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
