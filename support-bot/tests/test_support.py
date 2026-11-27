from types import SimpleNamespace
from unittest.mock import Mock

from sqlalchemy.exc import OperationalError

from tests.fakes import FakeBot, FakeReplies, make_handlers


def make_message(chat_id, text, user_id=None):
    return SimpleNamespace(
        chat=SimpleNamespace(id=chat_id),
        from_user=SimpleNamespace(id=user_id if user_id is not None else chat_id),
        text=text,
    )


def reply_callback(request_id, owner=999):
    return SimpleNamespace(
        id="click",
        data=f"reply:{request_id}",
        from_user=SimpleNamespace(id=owner),
        message=SimpleNamespace(chat=SimpleNamespace(id=owner)),
    )


def complete_request(support, chat_id, topic, question):
    support.receive_text(make_message(chat_id, topic))
    support.receive_text(make_message(chat_id, "Александр Иванов"))
    support.receive_text(make_message(chat_id, "@alex_ivanov"))
    support.receive_text(make_message(chat_id, "alex@example.com"))
    support.receive_text(make_message(chat_id, question))
    support.receive_text(make_message(chat_id, "Нет"))


def test_request_includes_required_contact_details_and_no_addition():
    bot = FakeBot()
    support = make_handlers(bot)

    complete_request(support, 123, "Гарантия", "Сломался экран")

    admin_message = bot.messages[-2]
    assert admin_message[0] == 999
    assert admin_message[1] == (
        "Вопрос по теме: Гарантия\n"
        "Имя: Александр Иванов\n"
        "Telegram: @alex_ivanov\n"
        "Email: alex@example.com\n"
        "\n"
        "Вопрос: Сломался экран\n"
        "Дополнение: Нет"
    )
    assert admin_message[2].keyboard[0][0].text == "Ответить"
    assert 123 not in support.requests.forms


def test_contact_fields_are_required_and_validated():
    bot = FakeBot()
    support = make_handlers(bot)

    support.receive_text(make_message(123, "Обслуживание"))
    support.receive_text(make_message(123, "   "))
    assert support.requests.forms[123].step == "full_name"

    support.receive_text(make_message(123, "Александр Иванов"))
    support.receive_text(make_message(123, "invalid username"))
    assert support.requests.forms[123].step == "username"

    support.receive_text(make_message(123, "@alex_ivanov"))
    support.receive_text(make_message(123, "not-an-email"))
    assert support.requests.forms[123].step == "email"

    support.receive_text(make_message(123, "alex@example.com"))
    assert support.requests.forms[123].step == "question"
    assert any("корректный email" in message[1] for message in bot.messages)


def test_form_instructions_are_sent_in_one_message():
    bot = FakeBot()
    support = make_handlers(bot)

    support.receive_text(make_message(123, "Гарантия"))

    assert len(bot.messages) == 1
    assert bot.messages[0][1] == (
        "Заполните заявку, отправляя ответы по одному сообщению:\n"
        "1. Укажите ваше имя.\n"
        "2. Укажите username в Telegram, например @username.\n"
        "3. Укажите ваш email.\n"
        "4. Напишите ваш вопрос."
    )


def test_question_cannot_be_empty_and_additions_are_preserved():
    bot = FakeBot()
    support = make_handlers(bot)

    support.receive_text(make_message(123, "Обслуживание"))
    support.receive_text(make_message(123, "Александр Иванов"))
    support.receive_text(make_message(123, "@alex_ivanov"))
    support.receive_text(make_message(123, "alex@example.com"))
    support.receive_text(make_message(123, "Как очистить устройство?"))
    support.receive_text(make_message(123, "   "))
    assert support.requests.forms[123].step == "addition"

    support.receive_text(make_message(123, "Модель X-200"))
    support.receive_text(make_message(123, "Нет"))

    assert bot.messages[-2][1].endswith(
        "Вопрос: Как очистить устройство?\n" "Дополнение: Модель X-200"
    )


def test_no_answer_accepts_case_and_punctuation():
    bot = FakeBot()
    support = make_handlers(bot)

    complete_request(support, 123, "Совместимость комплектующих", "Подойдет ли память?")
    assert bot.messages[-2][1].endswith("Дополнение: Нет")


def test_topic_name_can_be_used_as_question():
    bot = FakeBot()
    support = make_handlers(bot)

    support.receive_text(make_message(123, "Гарантия"))
    support.receive_text(make_message(123, "Александр Иванов"))
    support.receive_text(make_message(123, "@alex_ivanov"))
    support.receive_text(make_message(123, "alex@example.com"))
    support.receive_text(make_message(123, "Гарантия"))

    assert support.requests.forms[123].question == "Гарантия"
    assert support.requests.forms[123].step == "addition"


def test_delivery_failure_keeps_request_for_retry(caplog):
    bot = FakeBot()
    bot.fail_to_admin = True
    support = make_handlers(bot)

    support.receive_text(make_message(123, "Обслуживание"))
    support.receive_text(make_message(123, "Александр Иванов"))
    support.receive_text(make_message(123, "@alex_ivanov"))
    support.receive_text(make_message(123, "alex@example.com"))
    support.receive_text(make_message(123, "Как почистить?"))
    support.receive_text(make_message(123, "Нет"))

    assert support.requests.forms[123].step == "delivery_retry"
    assert support.requests.forms[123].question == "Как почистить?"
    assert "Не удалось отправить заявку" in bot.messages[-1][1]
    assert "Нажмите «Да»" in bot.messages[-1][1]
    assert bot.messages[-1][2].keyboard[0][0]["text"] == "Да"
    assert "Не удалось передать заявку" in caplog.text

    bot.fail_to_admin = False
    support.receive_text(make_message(123, "Да"))

    assert 123 not in support.requests.forms
    assert bot.messages[-2][0] == 999
    assert "Вопрос: Как почистить?" in bot.messages[-2][1]


def test_three_failed_retries_ask_user_to_start_over():
    bot = FakeBot()
    bot.fail_to_admin = True
    support = make_handlers(bot)
    complete_request(support, 123, "Обслуживание", "Как почистить?")

    for _ in range(3):
        assert support.requests.forms[123].step == "delivery_retry"
        support.receive_text(make_message(123, "Да"))

    assert 123 not in support.requests.forms
    assert "после трёх повторных попыток" in bot.messages[-1][1]
    assert bot.messages[-1][2].keyboard[0][0]["text"] == "Совместимость комплектующих"
    assert sum(message[0] == 999 for message in bot.attempted_messages) == 4


def test_admin_can_reply_to_persisted_request():
    replies = FakeReplies()
    bot = FakeBot()
    support = make_handlers(bot, replies)
    complete_request(support, 123, "Гарантия", "Сломался экран")

    request_id = bot.messages[-2][2].keyboard[0][0].callback_data.removeprefix("reply:")
    restarted_support = make_handlers(bot, replies)
    restarted_support.select_reply(reply_callback(request_id))
    restarted_support.receive_text(make_message(999, "Пожалуйста, пришлите номер заказа."))

    assert bot.messages[-2] == (
        123,
        f"Ответ поддержки по заявке #{request_id}:\n\nПожалуйста, пришлите номер заказа.",
        None,
    )
    assert restarted_support.replies.get_recipient(request_id) is None


def test_non_admin_cannot_start_reply():
    bot = FakeBot()
    support = make_handlers(bot)
    support.select_reply(reply_callback("unknown", owner=123))

    assert bot.callback_answers == [("click", "Эта кнопка доступна только владельцу.")]
    assert support.selected_request_id is None


def test_failed_admin_reply_can_be_retried(caplog):
    bot = FakeBot()
    support = make_handlers(bot)
    complete_request(support, 123, "Гарантия", "Сломался экран")
    request_id = bot.messages[-2][2].keyboard[0][0].callback_data.removeprefix("reply:")
    support.select_reply(reply_callback(request_id))

    bot.fail_to_user = True
    support.receive_text(make_message(999, "Ответ покупателю"))
    assert support.replies.get_recipient(request_id) == 123
    assert "Не удалось отправить ответ по заявке" in caplog.text

    bot.fail_to_user = False
    support.receive_text(make_message(999, "Ответ покупателю"))
    assert bot.messages[-2][0] == 123
    assert support.replies.get_recipient(request_id) is None


def test_long_addition_leaves_draft_ready_to_send():
    bot = FakeBot()
    support = make_handlers(bot)
    for text in ("Гарантия", "Имя", "@username", "buyer@example.com", "Вопрос"):
        support.receive_text(make_message(123, text))

    support.receive_text(make_message(123, "😀" * 2500))
    assert support.requests.forms[123].additions == []
    support.receive_text(make_message(123, "НЕТ!"))

    assert "Дополнение: Нет" in bot.messages[-2][1]


def test_selecting_closed_request_clears_previous_recipient():
    bot = FakeBot()
    replies = FakeReplies()
    replies.add("open", 123)
    support = make_handlers(bot, replies)

    support.select_reply(reply_callback("open"))
    assert support.selected_request_id == "open"

    support.select_reply(reply_callback("closed"))
    support.receive_text(make_message(999, "Ответ"))
    assert support.selected_request_id is None
    assert all(chat_id != 123 for chat_id, _, _ in bot.messages)


def test_sent_reply_is_deselected_if_closing_request_fails(monkeypatch):
    bot = FakeBot()
    replies = FakeReplies()
    replies.add("open", 123)
    support = make_handlers(bot, replies)
    support.select_reply(reply_callback("open"))
    monkeypatch.setattr(replies, "close", Mock(side_effect=OperationalError(None, None, OSError())))

    support.receive_text(make_message(999, "Ответ"))

    assert support.selected_request_id is None
    assert bot.messages[-2] == (123, "Ответ поддержки по заявке #open:\n\nОтвет", None)
    assert "закрыть заявку" in bot.messages[-1][1]
