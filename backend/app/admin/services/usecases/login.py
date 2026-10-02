"""Сценарий входа администратора по логину и паролю из настроек окружения."""

from secrets import compare_digest

from app.admin.schemas import AdminLoginSchema
from app.admin.services.exceptions import InvalidCredentialsError
from app.admin.services.validators import normalize_login
from app.config import Settings


class LoginAdminUseCase:
    """Сверить логин и пароль с ADMIN_LOGIN и ADMIN_PASSWORD."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def execute(self, payload: AdminLoginSchema) -> str:
        """Вернуть логин администратора, если данные верны. Иначе InvalidCredentialsError."""

        login = normalize_login(self.settings.admin_login)

        login_matches = compare_digest(normalize_login(payload.login).encode(), login.encode())
        password_matches = compare_digest(
            payload.password.encode(), self.settings.admin_password.encode()
        )

        if not (login_matches and password_matches):
            raise InvalidCredentialsError("Неверный логин или пароль")

        return login
