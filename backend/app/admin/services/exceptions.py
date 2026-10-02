"""Ошибки бизнес-логики администраторов. Роутеры переводят их в HTTP-коды."""


class InvalidCredentialsError(Exception):
    """Неверный логин или пароль."""


class AdminAlreadyExistsError(ValueError):
    """Администратор с таким логином уже есть."""


class WeakPasswordError(ValueError):
    """Пароль не проходит требования к сложности."""
