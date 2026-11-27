"""Разовый перенос открытых заявок из прежней версии бота."""

import argparse
import sqlite3
from contextlib import closing
from pathlib import Path

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.config import BotSettings
from app.database import create_bot_engine
from app.models import TelegramReply


def import_replies(path: Path, session: Session) -> int:
    """Перенести открытые обращения."""

    uri = path.resolve().as_uri() + "?mode=ro"
    inserted = 0
    with closing(sqlite3.connect(uri, uri=True)) as source:
        for request_id, chat_id in source.execute(
            "SELECT request_id, user_chat_id FROM pending_replies"
        ):
            if import_recipient(session, request_id, chat_id):
                inserted += 1
    return inserted


def import_recipient(session: Session, request_id: str, chat_id: int) -> bool:
    """Добавить нового адресата."""

    statement = (
        insert(TelegramReply)
        .values(request_id=request_id, chat_id=chat_id)
        .on_conflict_do_nothing(index_elements=[TelegramReply.request_id])
        .returning(TelegramReply.request_id)
    )
    return session.scalar(statement) is not None


def main() -> None:
    """Импортировать адресатов поддержки."""

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Путь к прежнему файлу support_requests.sqlite3")
    source = parser.parse_args().source
    engine = create_bot_engine(BotSettings().database_url)
    try:
        with Session(engine) as session, session.begin():
            count = import_replies(source, session)
        print(f"Перенесено заявок: {count}")
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
