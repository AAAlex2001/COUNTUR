from sqlalchemy import Engine, create_engine
from sqlalchemy.engine import make_url


def create_bot_engine(database_url: str) -> Engine:
    """Подключает синхронный Telegram-обработчик к PostgreSQL сайта."""

    url = make_url(database_url)
    if url.get_backend_name() != "postgresql":
        raise ValueError("Для бота требуется PostgreSQL")
    return create_engine(url.set(drivername="postgresql+psycopg"), pool_pre_ping=True)
