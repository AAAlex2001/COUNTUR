"""Хеширование паролей через bcrypt."""

import bcrypt


def hash_password(password: str) -> str:
    """Захешировать пароль. Возвращает строку, которую можно хранить в БД."""

    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)

    return hashed.decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """Проверить, что пароль соответствует хешу из БД."""

    password_bytes = password.encode("utf-8")
    hash_bytes = password_hash.encode("utf-8")

    try:
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except ValueError:
        return False
