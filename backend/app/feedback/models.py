from datetime import datetime
from enum import StrEnum

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class FeedbackStatus(StrEnum):
    """Обращение ждёт ответа или на него уже ответили."""

    NEW = "new"
    ANSWERED = "answered"


class FeedbackMessage(Base):
    """Обращение со страницы контактов. Ответ администратора уходит на email отправителя."""

    __tablename__ = "feedback_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    name: Mapped[str] = mapped_column(String(150))
    email: Mapped[str] = mapped_column(String(254))
    subject: Mapped[str] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(Text)

    status: Mapped[str] = mapped_column(String(16), default=FeedbackStatus.NEW, index=True)
    reply: Mapped[str | None] = mapped_column(Text)
    answered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
