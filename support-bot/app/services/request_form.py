import re
from dataclasses import dataclass, field
from enum import StrEnum

USERNAME = re.compile(r"@?[A-Za-z][A-Za-z0-9_]{4,31}")
EMAIL = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")
INSTRUCTIONS = (
    "Заполните заявку, отправляя ответы по одному сообщению:\n"
    "1. Укажите ваше имя.\n"
    "2. Укажите username в Telegram, например @username.\n"
    "3. Укажите ваш email.\n"
    "4. Напишите ваш вопрос."
)
ADDITION_PROMPT = "Что-то хотите дополнить? Напишите дополнение или нажмите «Нет»."


class Step(StrEnum):
    """Текущее поле заявки покупателя."""

    NAME = "full_name"
    USERNAME = "username"
    EMAIL = "email"
    QUESTION = "question"
    ADDITION = "addition"
    RETRY = "delivery_retry"


def message_fits(text: str) -> bool:
    """Проверяет размер текста в кодовых единицах UTF-16 для Telegram."""

    return len(text.encode("utf-16-le")) <= 4096 * 2


def answer_matches(text: str, expected: str) -> bool:
    """Распознаёт ответ с кнопки и его текстовый вариант с конечным знаком."""

    return bool(re.fullmatch(re.escape(expected) + r"[.!]?", text, re.IGNORECASE))


@dataclass
class RequestForm:
    """Хранит поля одного покупателя и переходит дальше после успешной проверки."""

    topic: str
    step: Step = Step.NAME
    full_name: str = ""
    username: str = ""
    email: str = ""
    question: str = ""
    additions: list[str] = field(default_factory=list)
    retries: int = 0

    def fill_contact(self, text: str) -> str:
        """Принимает очередной контакт или возвращает подсказку для исправления."""

        if self.step == Step.NAME:
            if not text or len(text) > 150:
                return "Укажите имя длиной от 1 до 150 символов."
            self.full_name = text
            self.step = Step.USERNAME

        elif self.step == Step.USERNAME:
            if not USERNAME.fullmatch(text):
                return "Укажите корректный username Telegram, например @username."
            self.username = "@" + text.removeprefix("@")
            self.step = Step.EMAIL

        elif self.step == Step.EMAIL:
            if len(text) > 254 or not EMAIL.fullmatch(text):
                return "Укажите корректный email, например name@example.com."
            self.email = text
            self.step = Step.QUESTION

        return ""

    def fill_question(self, text: str) -> str:
        """Принимает вопрос, который поместится в сообщение владельцу."""

        if not text:
            return "Вопрос не должен быть пустым. Пожалуйста, напишите его."
        if not message_fits(self.summary(question=text)):
            return "Вопрос слишком длинный. Сократите текст."

        self.question = text
        self.step = Step.ADDITION
        return ADDITION_PROMPT

    def add_note(self, text: str) -> str:
        """Дополняет заявку, сохраняя возможность отправить её одним сообщением."""

        if not text:
            return ADDITION_PROMPT
        if not message_fits(self.summary(extra=text)):
            return "Дополнение слишком длинное. Сократите его или нажмите «Нет»."

        self.additions.append(text)
        return "Дополнение сохранено. Напишите ещё или нажмите «Нет»."

    def summary(self, question: str | None = None, extra: str = "") -> str:
        """Собирает текст владельцу с учётом проверяемого вопроса или дополнения."""

        notes = self.additions + [extra] if extra else self.additions
        addition = "\n".join(notes) or "Нет"
        question_text = self.question if question is None else question
        return (
            f"Вопрос по теме: {self.topic}\nИмя: {self.full_name}\n"
            f"Telegram: {self.username}\nEmail: {self.email}\n\n"
            f"Вопрос: {question_text}\nДополнение: {addition}"
        )
