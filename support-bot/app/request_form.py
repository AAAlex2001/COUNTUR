from dataclasses import dataclass, field, replace
from enum import StrEnum

from email_validator import EmailNotValidError, validate_email

from app.messages import ADDITION_PROMPT, message_fits


class Step(StrEnum):
    """Шаг заявки."""

    NAME = "full_name"
    USERNAME = "username"
    EMAIL = "email"
    QUESTION = "question"
    ADDITION = "addition"
    RETRY = "delivery_retry"


def valid_username(value: str) -> bool:
    """Проверить имя пользователя Telegram."""

    name = value.removeprefix("@")
    return (
        5 <= len(name) <= 32
        and name.isascii()
        and name[0].isalpha()
        and all(char.isalnum() or char == "_" for char in name)
    )


@dataclass
class RequestForm:
    """Заявка покупателя."""

    topic: str
    step: Step = Step.NAME
    full_name: str = ""
    username: str = ""
    email: str = ""
    question: str = ""
    additions: list[str] = field(default_factory=list)
    retries: int = 0

    def accept(self, text: str) -> str:
        """Принять очередной ответ."""

        match self.step:
            case Step.NAME:
                return self.fill_name(text)
            case Step.USERNAME:
                return self.fill_username(text)
            case Step.EMAIL:
                return self.fill_email(text)
            case Step.QUESTION:
                return self.fill_question(text)
            case Step.ADDITION:
                return self.add_note(text)
        raise ValueError("Приём ответов завершён")

    def fill_name(self, text: str) -> str:
        """Записать имя покупателя."""

        if not text or len(text) > 150:
            return "Укажите имя длиной от 1 до 150 символов."

        self.full_name = text
        self.step = Step.USERNAME
        return ""

    def fill_username(self, text: str) -> str:
        """Записать контакт Telegram."""

        if not valid_username(text):
            return "Укажите корректный username Telegram, например @username."

        self.username = "@" + text.removeprefix("@")
        self.step = Step.EMAIL
        return ""

    def fill_email(self, text: str) -> str:
        """Записать электронную почту."""

        try:
            self.email = validate_email(text, check_deliverability=False).normalized
        except EmailNotValidError:
            return "Укажите корректный email, например name@example.com."

        self.step = Step.QUESTION
        return ""

    def fill_question(self, text: str) -> str:
        """Записать вопрос покупателя."""

        if not text:
            return "Вопрос не должен быть пустым. Пожалуйста, напишите его."
        candidate = replace(self, question=text)
        if not message_fits(candidate.summary()):
            return "Вопрос слишком длинный. Сократите текст."

        self.question = text
        self.step = Step.ADDITION
        return ADDITION_PROMPT

    def add_note(self, text: str) -> str:
        """Дополнить заявку покупателя."""

        if not text:
            return ADDITION_PROMPT
        candidate = replace(self, additions=self.additions + [text])
        if not message_fits(candidate.summary()):
            return "Дополнение слишком длинное. Сократите его или нажмите «Нет»."

        self.additions.append(text)
        return "Дополнение сохранено. Напишите ещё или нажмите «Нет»."

    def summary(self) -> str:
        """Собрать текст обращения."""

        addition = "\n".join(self.additions) or "Нет"
        return (
            f"Вопрос по теме: {self.topic}\nИмя: {self.full_name}\n"
            f"Telegram: {self.username}\nEmail: {self.email}\n\n"
            f"Вопрос: {self.question}\nДополнение: {addition}"
        )
