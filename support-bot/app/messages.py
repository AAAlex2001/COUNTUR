TELEGRAM_MESSAGE_LIMIT = 4096
INSTRUCTIONS = (
    "Заполните заявку, отправляя ответы по одному сообщению:\n"
    "1. Укажите ваше имя.\n"
    "2. Укажите username в Telegram, например @username.\n"
    "3. Укажите ваш email.\n"
    "4. Напишите ваш вопрос."
)
ADDITION_PROMPT = "Что-то хотите дополнить? Напишите дополнение или нажмите «Нет»."


def message_fits(text: str) -> bool:
    """Проверить длину сообщения Telegram."""

    return len(text.encode("utf-16-le")) // 2 <= TELEGRAM_MESSAGE_LIMIT
