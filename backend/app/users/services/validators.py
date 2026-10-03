"""Проверка и нормализация данных покупателя."""

from app.users.services.exceptions import WeakPasswordError

PASSWORD_MAX_BYTES = 72


def normalize_email(email: str) -> str:
    """Email в нижнем регистре без пробелов по краям, чтобы один адрес не стал двумя аккаунтами."""

    return email.strip().lower()


def validate_password(password: str) -> None:
    """Пароль: хотя бы одна буква и одна цифра, не длиннее 72 байт (ограничение bcrypt)."""

    if len(password.encode("utf-8")) > PASSWORD_MAX_BYTES:
        raise WeakPasswordError(f"Пароль должен быть не длиннее {PASSWORD_MAX_BYTES} байт")

    has_letter = any(char.isalpha() for char in password)
    has_digit = any(char.isdigit() for char in password)

    if not has_letter or not has_digit:
        raise WeakPasswordError("Пароль должен содержать хотя бы одну букву и одну цифру")
