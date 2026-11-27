import os
import sqlite3
from contextlib import closing
from uuid import uuid4

import pytest
from sqlalchemy import delete
from sqlalchemy.orm import sessionmaker

from app.database import create_bot_engine
from app.models import TelegramReply
from app.services.repo import ReplyRepository
from scripts.import_telegram_replies import import_replies


@pytest.fixture
def sessions():
    url = os.getenv("TEST_DATABASE_URL")
    if not url:
        pytest.skip("Для проверки PostgreSQL задайте TEST_DATABASE_URL и примените миграции")

    engine = create_bot_engine(url)
    try:
        yield sessionmaker(engine)
    finally:
        engine.dispose()


def test_open_and_close_across_restarts(sessions):
    request_id = uuid4().hex
    try:
        ReplyRepository(sessions).add(request_id, 9_876_543_210)
        restarted = ReplyRepository(sessions)
        assert restarted.recipient(request_id) == 9_876_543_210
        restarted.close(request_id)
        assert restarted.recipient(request_id) is None
    finally:
        with sessions.begin() as db:
            db.execute(delete(TelegramReply).where(TelegramReply.request_id == request_id))


def test_import_preserves_existing_and_closed_requests(sessions, tmp_path):
    path = tmp_path / "old.sqlite3"
    request_id = uuid4().hex
    with closing(sqlite3.connect(path)) as legacy:
        legacy.execute(
            "CREATE TABLE pending_replies (request_id TEXT PRIMARY KEY, user_chat_id INTEGER)"
        )
        legacy.execute("INSERT INTO pending_replies VALUES (?, ?)", (request_id, 123))
        legacy.commit()

    replies = ReplyRepository(sessions)
    try:
        with sessions.begin() as db:
            assert import_replies(path, db) == 1
            assert import_replies(path, db) == 0
        assert replies.recipient(request_id) == 123
        replies.close(request_id)
        with sessions.begin() as db:
            assert import_replies(path, db) == 0
        assert replies.recipient(request_id) is None
    finally:
        with sessions.begin() as db:
            db.execute(delete(TelegramReply).where(TelegramReply.request_id == request_id))
