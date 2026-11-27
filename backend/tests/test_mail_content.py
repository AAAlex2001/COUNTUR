import asyncio
from datetime import UTC, datetime
from decimal import Decimal
from email.message import EmailMessage
from unittest.mock import MagicMock

import pytest

from app.config import get_settings
from app.mail import EmailClient
from app.mail_content import MailContent
from app.orders.letters import REPLY_EMAIL, order_confirmation
from app.orders.models import DeliveryMethod, Order, OrderItem
from app.stock_notifications.letters import stock_notification


def test_order_confirmation_uses_order_snapshot() -> None:
    order = Order(
        id=42,
        customer_name="Анна <А>",
        delivery_method=DeliveryMethod.PICKUP,
        total=Decimal("14990.50"),
        payment_method="invoice",
        created_at=datetime(2026, 11, 27, 11, 15, tzinfo=UTC),
        items=[
            OrderItem(product_name="DDR5", product_sku="KF5", price=Decimal("7495.25"), quantity=2)
        ],
    )
    settings = get_settings().model_copy(update={"shop_timezone": "Europe/Moscow"})
    mail = order_confirmation(order, "123-45", settings)
    text = mail.text()
    assert "CT-000042" in text
    assert "27.11.2026 в 14:15" in text
    assert "DDR5 — 2 шт. (арт. KF5) — 14 990,50 ₽" in text
    assert "НДС не облагается, УСН" in text
    assert "По счёту" in text
    assert "трек-номер" not in text
    assert mail.reply_to == REPLY_EMAIL
    assert "Анна &lt;А&gt;" in mail.html()


@pytest.mark.parametrize(("port", "transport"), [(465, "SMTP_SSL"), (587, "SMTP")])
def test_send_multipart_mail(monkeypatch, port, transport) -> None:
    settings = get_settings().model_copy(
        update={
            "smtp_host": "example.test",
            "smtp_port": port,
            "smtp_user": "sender@example.test",
            "smtp_password": "test",
            "smtp_from": "",
            "smtp_tls": True,
        }
    )
    connect = MagicMock()
    monkeypatch.setattr(f"app.mail.smtplib.{transport}", connect)
    content = MailContent(subject="Ответ", heading="Поддержка", body="a<b\nНовая строка")
    asyncio.run(EmailClient(settings).send("buyer@example.test", content))

    smtp = connect.return_value.__enter__.return_value
    assert smtp.starttls.call_count == (1 if port == 587 else 0)
    smtp.login.assert_called_once_with("sender@example.test", "test")
    letter: EmailMessage = smtp.send_message.call_args.args[0]
    assert letter["From"] == "sender@example.test"
    assert letter["To"] == "buyer@example.test"
    assert letter.get_content_type() == "multipart/alternative"
    assert "a<b\nНовая строка" in letter.get_body(("plain",)).get_content()
    assert "a&lt;b<br>Новая строка" in letter.get_body(("html",)).get_content()


def test_stock_mail_links_to_requested_product() -> None:
    content = stock_notification("DDR5", "ddr5", "https://shop.example/")
    assert "DDR5" in content.body
    assert content.link_url == "https://shop.example/product/ddr5"


def test_plain_text_preserves_paragraphs_and_groups_order_rows() -> None:
    """Отделить разделы письма и сохранить строки списка."""

    content = MailContent(
        subject="Заказ оформлен",
        heading="Здравствуйте, Анна!",
        body="Приняли ваш заказ.",
        items=("Карта <X>", "Блок питания"),
        details=(("Итого", "42 000 ₽"), ("Доставка", "СДЭК")),
        link_label="Мои заказы",
        link_url="https://example.test/orders?a=1&b=2",
        note="Ответьте, если нужно изменить заказ.",
        signature="С уважением,\nКоманда COUNTUR",
    )

    assert content.text().split("\n\n") == [
        "Здравствуйте, Анна!",
        "Приняли ваш заказ.",
        "Состав заказа:\n1. Карта <X>\n2. Блок питания",
        "Итого: 42 000 ₽\nДоставка: СДЭК",
        "Мои заказы: https://example.test/orders?a=1&b=2",
        "Ответьте, если нужно изменить заказ.",
        "С уважением,\nКоманда COUNTUR",
    ]


def test_support_reply_preserves_line_breaks_and_escapes_html() -> None:
    """Сохранить текст оператора в обеих версиях письма."""

    content = MailContent(
        subject="Ответ поддержки",
        heading="Здравствуйте!",
        body="Деталь <А>\n\nЦена & наличие",
        signature="С уважением,\nОператор <Б>",
    )

    assert (
        content.text()
        == "Здравствуйте!\n\nДеталь <А>\n\nЦена & наличие\n\nС уважением,\nОператор <Б>"
    )
    html = content.html()
    assert "Деталь &lt;А&gt;<br><br>Цена &amp; наличие" in html
    assert "С уважением,<br>Оператор &lt;Б&gt;" in html
