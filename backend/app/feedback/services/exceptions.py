"""Ошибки бизнес-логики обращений. Роутеры переводят их в HTTP-коды."""


class MailNotConfiguredError(RuntimeError):
    """Отправка писем не настроена: нет SMTP в окружении."""


class MailDeliveryError(RuntimeError):
    """Почтовый сервер не принял письмо."""
