from types import SimpleNamespace
from unittest.mock import Mock

from requests import ConnectionError
from telebot import TeleBot
from telebot.types import Update

from app.polling import TelegramPolling
from tests.fakes import FakeReplies, make_handlers


def test_polling_delivers_reply_after_button_in_same_batch(monkeypatch):
    bot = TeleBot("12345:test", threaded=False)
    polling = TelegramPolling(bot)
    replies = FakeReplies()
    replies.add("open-request", 123)
    make_handlers(bot, replies).register()

    owner = {"id": 999, "first_name": "Owner", "is_bot": False}
    owner_chat = {"id": 999, "type": "private"}
    message = {"message_id": 1, "date": 1, "chat": owner_chat, "from": owner}
    callback = {
        "id": "click",
        "chat_instance": "owner",
        "from": owner,
        "message": message,
        "data": "reply:open-request",
    }
    updates = [
        Update.de_json({"update_id": 10, "callback_query": callback}),
        Update.de_json({"update_id": 11, "message": dict(message, text="Ответ владельца")}),
    ]
    offsets = []
    sent = []

    def get_updates(offset, allowed_updates, timeout, long_polling_timeout):
        offsets.append(offset)
        if len(offsets) == 1:
            return updates
        polling.stop(15, None)
        return []

    monkeypatch.setattr(bot, "get_me", lambda: SimpleNamespace(username="test_bot"))
    monkeypatch.setattr(bot, "get_updates", get_updates)
    monkeypatch.setattr(bot, "send_message", lambda chat, text: sent.append((chat, text)))
    monkeypatch.setattr(bot, "answer_callback_query", lambda callback_id: None)

    monkeypatch.setattr(bot, "delete_webhook", lambda drop_pending_updates: True)
    polling.run()

    assert offsets == [0, 12]
    assert (123, "Ответ поддержки по заявке #open-request:\n\nОтвет владельца") in sent
    assert replies.get_recipient("open-request") is None


def test_startup_recovers_without_logging_bot_token(monkeypatch, caplog):
    bot = Mock()
    bot.delete_webhook.side_effect = [ConnectionError("private-token"), True]
    polling = TelegramPolling(bot)
    monkeypatch.setattr(polling.stopped, "wait", lambda timeout: None)

    def finish_polling(offset, allowed_updates, timeout, long_polling_timeout):
        polling.stopped.set()
        return []

    bot.get_updates.side_effect = finish_polling

    polling.run()

    assert bot.delete_webhook.call_count == 2
    assert bot.get_updates.call_count == 1
    assert "ConnectionError" in caplog.text
    assert "private-token" not in caplog.text


def test_failed_handler_keeps_update_pending_until_retry(monkeypatch, caplog):
    bot = Mock()
    first = SimpleNamespace(update_id=50)
    second = SimpleNamespace(update_id=51)
    bot.get_updates.return_value = [first, second]
    bot.process_new_updates.side_effect = [RuntimeError("private-token"), None, None]
    polling = TelegramPolling(bot)
    waits = []
    monkeypatch.setattr(polling.stopped, "wait", lambda seconds: waits.append(seconds))

    polling.receive()

    assert bot.get_updates.call_count == 1
    assert bot.process_new_updates.call_count == 1
    assert polling.offset == 0
    assert waits == [5]
    assert "событие 50" in caplog.text
    assert "RuntimeError" in caplog.text
    assert "private-token" not in caplog.text
    assert "Traceback" not in caplog.text
    assert "receive" in caplog.text

    polling.receive()

    assert bot.get_updates.call_count == 2
    assert bot.get_updates.call_args_list[0].kwargs["offset"] == 0
    assert bot.get_updates.call_args_list[1].kwargs["offset"] == 0
    assert bot.process_new_updates.call_count == 3
    bot.process_new_updates.assert_called_with([second])
    assert polling.offset == 52
