"""Модель активной сессии входа."""

from datetime import datetime

from sqlalchemy import DateTime, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.base import Base


class AuthSession(Base):
    """Активный вход пользователя или администратора."""

    __tablename__ = "auth_sessions"
    __table_args__ = (Index("ix_auth_sessions_expires_at", "expires_at"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    subject: Mapped[str] = mapped_column(String(254), nullable=False)
    role: Mapped[str] = mapped_column(String(16), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
