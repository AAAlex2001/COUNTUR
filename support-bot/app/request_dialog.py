from telebot import TeleBot
from telebot.types import ReplyKeyboardRemove

from app.keyboards import TOPICS, reply_keyboard
from app.messages import INSTRUCTIONS
from app.request_form import RequestForm, Step
from app.usecases.forward_request import ForwardRequestUseCase

MAX_RETRIES = 3


def answer_matches(text: str, expected: str) -> bool:
    """Распознать ответ покупателя."""

    answer = expected.casefold()
    return text.casefold() in (answer, answer + ".", answer + "!")


class RequestDialog:
    """Диалог с покупателем."""

    def __init__(self, bot: TeleBot, forward: ForwardRequestUseCase) -> None:
        """Подключить отправку заявок."""

        self.bot = bot
        self.forward = forward
        self.forms: dict[int, RequestForm] = {}

    def start(self, chat_id: int) -> None:
        """Предложить темы обращения."""

        self.forms.pop(chat_id, None)
        self.bot.send_message(
            chat_id, "Здравствуйте! Выберите тему вопроса:", reply_markup=reply_keyboard(TOPICS)
        )

    def receive(self, chat_id: int, text: str) -> None:
        """Принять сообщение покупателя."""

        form = self.forms.get(chat_id)
        if form is None:
            self.choose_topic(chat_id, text)
            return

        if form.step == Step.RETRY:
            self.retry(chat_id, form, text)
            return

        if form.step == Step.ADDITION and answer_matches(text, "Нет"):
            self.submit(chat_id, form)
            return

        prompt = form.accept(text)
        if prompt:
            keyboard = reply_keyboard(["Нет"]) if form.step == Step.ADDITION else None
            self.bot.send_message(chat_id, prompt, reply_markup=keyboard)

    def choose_topic(self, chat_id: int, text: str) -> None:
        """Начать заполнение заявки."""

        if text not in TOPICS:
            self.bot.send_message(
                chat_id, "Сначала выберите тему вопроса:", reply_markup=reply_keyboard(TOPICS)
            )
            return

        self.forms[chat_id] = RequestForm(topic=text)
        self.bot.send_message(chat_id, INSTRUCTIONS, reply_markup=ReplyKeyboardRemove())

    def retry(self, chat_id: int, form: RequestForm, text: str) -> None:
        """Повторить отправку заявки."""

        if not answer_matches(text, "Да"):
            self.bot.send_message(
                chat_id, "Для повторной отправки нажмите «Да».", reply_markup=reply_keyboard(["Да"])
            )
            return

        form.retries += 1
        self.submit(chat_id, form)

    def submit(self, chat_id: int, form: RequestForm) -> None:
        """Передать обращение владельцу."""

        if self.forward.execute(chat_id, form.summary()):
            self.finish(chat_id, "Спасибо! Ваша заявка отправлена в службу поддержки.")
            return

        if form.retries >= MAX_RETRIES:
            self.finish(
                chat_id,
                "Не удалось отправить заявку после трёх повторных попыток. Заполните её позже.",
            )
            return

        form.step = Step.RETRY
        self.bot.send_message(
            chat_id,
            "Не удалось отправить заявку. Нажмите «Да» для повтора.",
            reply_markup=reply_keyboard(["Да"]),
        )

    def finish(self, chat_id: int, notice: str) -> None:
        """Завершить обращение покупателя."""

        del self.forms[chat_id]
        self.bot.send_message(chat_id, notice, reply_markup=reply_keyboard(TOPICS))
