from app.handlers import SupportHandlers
from app.services.usecases.forward_request import ForwardRequestUseCase
from app.services.usecases.reply_to_request import ReplyToRequestUseCase


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
            raise RuntimeError("Telegram API unavailable")
        if chat_id == 123 and self.fail_to_user:
            raise RuntimeError("Telegram API unavailable")
        self.messages.append((chat_id, text, reply_markup))

    def answer_callback_query(self, callback_id, text=None):
        self.callback_answers.append((callback_id, text))


class FakeReplies:
    """Хранит адресатов в памяти для тестов диалога."""

    def __init__(self):
        self.recipients = {}

    def add(self, request_id, chat_id):
        self.recipients[request_id] = chat_id

    def recipient(self, request_id):
        return self.recipients.get(request_id)

    def close(self, request_id):
        self.recipients.pop(request_id, None)


def make_handlers(bot, replies=None):
    if replies is None:
        replies = FakeReplies()
    return SupportHandlers(
        bot, 999, ForwardRequestUseCase(bot, 999, replies), ReplyToRequestUseCase(bot, replies)
    )
