"""Проверка и нормализация данных администратора."""

from app.admin.services.exceptions import WeakPasswordError

PASSWORD_MIN_LENGTH = 10
PASSWORD_MAX_BYTES = 72


def normalize_login(login: str) -> str:
    """Логин в нижнем регистре без пробелов по краям, чтобы Admin и admin были одним человеком."""

    return login.strip().lower()


def validate_password(password: str) -> None:
    """Пароль: от 10 символов до 72 байт, хотя бы одна буква и одна цифра."""

    if len(password) < PASSWORD_MIN_LENGTH:
        raise WeakPasswordError(f"Пароль должен быть не короче {PASSWORD_MIN_LENGTH} символов")

    if len(password.encode("utf-8")) > PASSWORD_MAX_BYTES:
        raise WeakPasswordError(f"Пароль должен быть не длиннее {PASSWORD_MAX_BYTES} байт")

    has_letter = any(char.isalpha() for char in password)
    has_digit = any(char.isdigit() for char in password)

    if not has_letter or not has_digit:
        raise WeakPasswordError("Пароль должен содержать хотя бы одну букву и одну цифру")
