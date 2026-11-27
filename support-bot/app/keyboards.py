from telebot.types import InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup

REPLY_PREFIX = "reply:"
TOPICS = ["Совместимость комплектующих", "Гарантия", "Обслуживание"]


def reply_keyboard(labels: list[str]) -> ReplyKeyboardMarkup:
    """Располагает каждую кнопку ответа в отдельной строке."""

    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    for label in labels:
        keyboard.row(label)
    return keyboard


def reply_button(request_id: str) -> InlineKeyboardMarkup:
    """Привязывает кнопку владельца к конкретной заявке."""

    keyboard = InlineKeyboardMarkup()
    keyboard.add(InlineKeyboardButton("Ответить", callback_data=f"{REPLY_PREFIX}{request_id}"))
    return keyboard
