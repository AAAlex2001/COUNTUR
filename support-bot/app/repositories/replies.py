from sqlalchemy import select, update
from sqlalchemy.orm import Session, sessionmaker

from app.models import TelegramReply


class ReplyRepository:
    """Адресаты ответов поддержки."""

    def __init__(self, sessions: sessionmaker[Session]) -> None:
        """Подключить базу обращений."""

        self.sessions = sessions

    def add(self, request_id: str, chat_id: int) -> None:
        """Сохранить адресата обращения."""

        with self.sessions.begin() as session:
            session.add(TelegramReply(request_id=request_id, chat_id=chat_id))

    def get_recipient(self, request_id: str) -> int | None:
        """Найти чат покупателя."""

        query = select(TelegramReply.chat_id).where(TelegramReply.request_id == request_id)
        with self.sessions() as session:
            return session.scalar(query)

    def close(self, request_id: str) -> None:
        """Закрыть обращение."""

        statement = (
            update(TelegramReply).where(TelegramReply.request_id == request_id).values(chat_id=None)
        )
        with self.sessions.begin() as session:
            session.execute(statement)
