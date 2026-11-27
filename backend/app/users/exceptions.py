"""Ошибки бизнес-логики покупателей. Роутеры переводят их в HTTP-коды."""


class EmailAlreadyTakenError(ValueError):
    """На этот email уже зарегистрирован аккаунт."""


class WeakPasswordError(ValueError):
    """Пароль не проходит требования к сложности."""


class InvalidCredentialsError(Exception):
    """Неверный email или пароль."""
