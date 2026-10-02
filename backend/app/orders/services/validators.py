"""Проверка и нормализация данных заказа."""

from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

from app.orders.models import OrderStatus
from app.orders.services.exceptions import InvalidPhoneError, OrderStatusError

PHONE_MIN_DIGITS = 10
PHONE_MAX_DIGITS = 15


def normalize_phone(phone: str) -> str:
    """Оставить в телефоне только цифры и ведущий плюс: «+7 (999) 000-00-00» → «+79990000000»."""

    stripped = phone.strip()
    digits = "".join(char for char in stripped if char.isdigit())

    if len(digits) < PHONE_MIN_DIGITS or len(digits) > PHONE_MAX_DIGITS:
        raise InvalidPhoneError("Укажите телефон в формате +7 999 000-00-00")

    if stripped.startswith("+"):
        return "+" + digits

    return digits


def validate_status_change(current: str, new: OrderStatus | None) -> None:
    """Отменённый заказ остаётся отменённым: его товары уже вернулись на склад."""

    if current == OrderStatus.CANCELED and new is not None and new != OrderStatus.CANCELED:
        raise OrderStatusError("Отменённый заказ нельзя вернуть в работу")


def day_bounds(day: date, timezone_name: str) -> tuple[datetime, datetime]:
    """Начало и конец календарного дня в часовом поясе магазина, переведённые в UTC."""

    start_local = datetime.combine(day, time.min, tzinfo=ZoneInfo(timezone_name))
    start = start_local.astimezone(timezone.utc)

    return start, start + timedelta(days=1)
