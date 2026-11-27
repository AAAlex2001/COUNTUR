from sqlalchemy import select, update
from sqlalchemy.orm import Session, sessionmaker

from app.models import TelegramReply


class ReplyRepository:
    """Хранит адресатов ответов в PostgreSQL. Каждая операция получает свою сессию."""

    def __init__(self, sessions: sessionmaker[Session]) -> None:
        self.sessions = sessions

    def add(self, request_id: str, chat_id: int) -> None:
        """Запоминает адресата до отправки кнопки владельцу."""

        with self.sessions.begin() as session:
            session.add(TelegramReply(request_id=request_id, chat_id=chat_id))

    def recipient(self, request_id: str) -> int | None:
        """Возвращает чат покупателя для открытой заявки."""

        query = select(TelegramReply.chat_id).where(TelegramReply.request_id == request_id)
        with self.sessions() as session:
            return session.scalar(query)

    def close(self, request_id: str) -> None:
        """Очищает адресата. Номер остаётся закрытым и при повторном импорте."""

        statement = (
            update(TelegramReply).where(TelegramReply.request_id == request_id).values(chat_id=None)
        )
        with self.sessions.begin() as session:
            session.execute(statement)
