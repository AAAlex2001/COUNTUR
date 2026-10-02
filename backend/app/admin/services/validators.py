"""Нормализация данных администратора."""


def normalize_login(login: str) -> str:
    """Логин в нижнем регистре без пробелов по краям, чтобы Admin и admin были одним человеком."""

    return login.strip().lower()
