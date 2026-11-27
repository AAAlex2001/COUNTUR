from decimal import Decimal
from zoneinfo import ZoneInfo

from app.config import Settings
from app.mail_content import MailContent
from app.orders.models import DeliveryMethod, Order, OrderItem

REPLY_EMAIL = "SOHINALEKSANDR638@GMAIL.COM"
SIGNATURE = (
    "С уважением,\nИП Шохин А.С.\nОГРНИП 326320000050905, ИНН 324900980417\n"
    f"Email: {REPLY_EMAIL}\nСайт: 24countur.ru"
)
DELIVERY_METHODS = {
    DeliveryMethod.COURIER: "Курьер",
    DeliveryMethod.PICKUP_POINT: "СДЭК, пункт выдачи",
    DeliveryMethod.PICKUP: "Самовывоз",
}
PAYMENT_METHODS = {"card": "Онлайн картой", "invoice": "По счёту"}


def format_rubles(value: Decimal) -> str:
    """Записать сумму в рублях."""

    amount = f"{value:,.2f}".replace(",", " ").replace(".", ",")
    return f"{amount.removesuffix(',00')} ₽"


def item_line(item: OrderItem) -> str:
    """Описать позицию заказа."""

    sku = f" (арт. {item.product_sku})" if item.product_sku else ""
    return f"{item.product_name} — {item.quantity} шт.{sku} — {format_rubles(item.subtotal)}"


def order_details(order: Order) -> tuple[tuple[str, str], ...]:
    """Указать условия заказа."""

    delivery = DELIVERY_METHODS[order.delivery_method]
    if order.delivery_address:
        delivery += f", {order.delivery_address}"

    return (
        ("Итого", f"{format_rubles(order.total)} (НДС не облагается, УСН)"),
        ("Способ оплаты", PAYMENT_METHODS.get(order.payment_method, "Уточним при подтверждении")),
        ("Статус", "Принят в работу"),
        ("Ориентировочная дата отгрузки", "Уточним при подтверждении"),
        ("Доставка", delivery),
    )


def support_note(phone: str, delivery_method: str) -> str:
    """Подсказать способ связи."""

    note = "Если нужно изменить заказ, ответьте на это письмо"
    if phone:
        note += f" или позвоните {phone} (пн–пт 10:00–19:00)"

    if delivery_method == DeliveryMethod.PICKUP:
        return f"{note}."

    return f"{note}. После передачи в службу доставки пришлём трек-номер отдельным письмом."


def order_confirmation(order: Order, phone: str, settings: Settings) -> MailContent:
    """Подтвердить оформление заказа."""

    number = f"CT-{order.id:06d}"
    placed_at = order.created_at.astimezone(ZoneInfo(settings.shop_timezone)).strftime(
        "%d.%m.%Y в %H:%M"
    )

    return MailContent(
        subject=f"COUNTUR — заказ №{number} оформлен",
        heading=f"Здравствуйте, {order.customer_name}!",
        body=f"Ваш заказ №{number} от {placed_at} успешно оформлен и принят в работу.",
        items=tuple(item_line(item) for item in order.items),
        details=order_details(order),
        link_label="Отследить заказ в личном кабинете",
        link_url=f"{settings.site_url.rstrip('/')}/account/orders",
        note=support_note(phone, order.delivery_method),
        signature=SIGNATURE,
        reply_to=REPLY_EMAIL,
    )


def shipment_notice(order: Order, tracking_number: str, settings: Settings) -> MailContent:
    """Сообщить трек-номер заказа."""

    number = f"CT-{order.id:06d}"
    return MailContent(
        subject=f"COUNTUR — заказ №{number} передан в доставку",
        heading=f"Здравствуйте, {order.customer_name}!",
        body=f"Ваш заказ №{number} передан в службу доставки.",
        details=(("Трек-номер", tracking_number),),
        link_label="Мои заказы",
        link_url=f"{settings.site_url.rstrip('/')}/account/orders",
        signature=SIGNATURE,
        reply_to=REPLY_EMAIL,
    )
