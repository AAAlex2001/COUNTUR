import asyncio
import smtplib
from email.message import EmailMessage

from app.config import Settings
from app.mail_content import MailContent


class MailDeliveryError(RuntimeError):
    """Ошибка доставки письма."""


class MailNotConfiguredError(RuntimeError):
    """Отсутствуют настройки почты."""


def build_message(sender: str, recipient: str, content: MailContent) -> EmailMessage:
    """Подготовить письмо к отправке."""

    message = EmailMessage()
    message["From"] = sender
    message["To"] = recipient
    message["Subject"] = " ".join(content.subject.splitlines())
    if content.reply_to:
        message["Reply-To"] = content.reply_to

    message.set_content(content.text())
    message.add_alternative(content.html(), subtype="html")
    return message


class EmailClient:
    """Почтовый клиент магазина."""

    def __init__(self, settings: Settings) -> None:
        """Сохранить настройки почты."""

        self.settings = settings

    async def send(self, recipient: str, content: MailContent) -> None:
        """Отправить письмо покупателю."""

        await asyncio.to_thread(self.send_smtp, recipient, content)

    def send_smtp(self, recipient: str, content: MailContent) -> None:
        """Передать письмо SMTP-серверу."""

        settings = self.settings
        if not settings.smtp_host:
            raise MailNotConfiguredError("Отправка писем не настроена")

        message = build_message(settings.smtp_from or settings.smtp_user, recipient, content)
        implicit_tls = settings.smtp_port == 465
        connect = smtplib.SMTP_SSL if implicit_tls else smtplib.SMTP

        try:
            with connect(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
                if settings.smtp_tls and not implicit_tls:
                    smtp.starttls()
                if settings.smtp_user:
                    smtp.login(settings.smtp_user, settings.smtp_password)
                smtp.send_message(message)
        except (smtplib.SMTPException, OSError) as error:
            raise MailDeliveryError("Почтовый сервер не принял письмо") from error
