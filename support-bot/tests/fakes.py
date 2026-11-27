from requests import ConnectionError

from app.dependencies import build_handlers


class FakeBot:
    def __init__(self):
        self.messages = []
        self.attempted_messages = []
        self.callback_answers = []
        self.fail_to_admin = False
        self.fail_to_user = False

    def send_message(self, chat_id, text, reply_markup=None):
        self.attempted_messages.append((chat_id, text, reply_markup))
        if chat_id == 999 and self.fail_to_admin:
            raise ConnectionError("Telegram API unavailable")
        if chat_id == 123 and self.fail_to_user:
            raise ConnectionError("Telegram API unavailable")
        self.messages.append((chat_id, text, reply_markup))

    def answer_callback_query(self, callback_id, text=None):
        self.callback_answers.append((callback_id, text))


class FakeReplies:
    """Хранит адресатов в памяти для тестов диалога."""

    def __init__(self):
        self.recipients = {}

    def add(self, request_id, chat_id):
        self.recipients[request_id] = chat_id

    def get_recipient(self, request_id):
        return self.recipients.get(request_id)

    def close(self, request_id):
        self.recipients.pop(request_id, None)


def make_handlers(bot, replies=None):
    if replies is None:
        replies = FakeReplies()
    return build_handlers(bot=bot, owner_chat_id=999, replies=replies)
