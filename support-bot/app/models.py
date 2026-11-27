from sqlalchemy import BigInteger, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Метаданные таблиц сервиса поддержки."""


class TelegramReply(Base):
    """Связывает кнопку ответа с чатом покупателя, пока заявка открыта."""

    __tablename__ = "telegram_replies"

    request_id: Mapped[str] = mapped_column(String(32), primary_key=True)
    chat_id: Mapped[int | None] = mapped_column(BigInteger)
