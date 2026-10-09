"""Отправка писем через SMTP из настроек. Без SMTP_HOST письма не уходят."""

import asyncio
import smtplib
from email.message import EmailMessage

from app.config import get_settings
from app.feedback.services.exceptions import MailDeliveryError, MailNotConfiguredError


def deliver(to: str, subject: str, body: str) -> None:
    """Отправить письмо синхронно. Вызывается из потока, чтобы не блокировать сервер."""

    settings = get_settings()
    if not settings.smtp_host:
        raise MailNotConfiguredError("Отправка писем не настроена")

    letter = EmailMessage()
    letter["From"] = settings.smtp_from or settings.smtp_user
    letter["To"] = to
    letter["Subject"] = subject
    letter.set_content(body)

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
            if settings.smtp_tls:
                smtp.starttls()
            if settings.smtp_user:
                smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(letter)
    except (smtplib.SMTPException, OSError) as error:
        raise MailDeliveryError("Почтовый сервер не принял письмо") from error


async def send_mail(to: str, subject: str, body: str) -> None:
    """Отправить письмо, не блокируя обработку других запросов."""

    await asyncio.to_thread(deliver, to, subject, body)
