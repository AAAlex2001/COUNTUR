from sqlalchemy import BigInteger, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Модели поддержки."""


class TelegramReply(Base):
    """Адресат ответа поддержки."""

    __tablename__ = "telegram_replies"

    request_id: Mapped[str] = mapped_column(String(32), primary_key=True)
    chat_id: Mapped[int | None] = mapped_column(BigInteger)
