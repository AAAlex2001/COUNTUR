from types import SimpleNamespace

from telebot.types import Update

from app.main import PollingBot
from tests.fakes import FakeReplies, make_handlers


def test_polling_delivers_reply_after_button_in_same_batch(monkeypatch):
    bot = PollingBot("12345:test", threaded=False)
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
        bot.stop_polling()
        return []

    monkeypatch.setattr(bot, "get_me", lambda: SimpleNamespace(username="test_bot"))
    monkeypatch.setattr(bot, "get_updates", get_updates)
    monkeypatch.setattr(bot, "send_message", lambda chat, text: sent.append((chat, text)))
    monkeypatch.setattr(bot, "answer_callback_query", lambda callback_id: None)

    bot.polling(allowed_updates=["message", "callback_query"])

    assert offsets == [1, 12]
    assert (123, "Ответ поддержки по заявке #open-request:\n\nОтвет владельца") in sent
    assert replies.recipient("open-request") is None
