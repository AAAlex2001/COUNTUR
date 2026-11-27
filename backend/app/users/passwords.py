"""Хеширование паролей через bcrypt."""

import bcrypt


def hash_password(password: str) -> str:
    """Захешировать пароль. Возвращает строку, которую можно хранить в БД."""

    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """Проверить, что пароль соответствует хешу из БД."""

    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False
