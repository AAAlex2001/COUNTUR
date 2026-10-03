"""Сценарий изменения профиля покупателя."""

from app.users.models import User
from app.users.schemas import UserUpdateSchema
from app.users.services.exceptions import EmailAlreadyTakenError
from app.users.services.repo import UserRepository
from app.users.services.validators import normalize_email


class UpdateProfileUseCase:
    """Изменить имя, контакты, адрес и настройки уведомлений."""

    def __init__(self, users: UserRepository) -> None:
        self.users = users

    async def execute(self, user: User, payload: UserUpdateSchema) -> User:
        """Вернуть обновлённого покупателя. Новый email должен быть свободен."""

        changes = payload.model_dump(exclude_unset=True)

        if "email" in changes:
            email = normalize_email(changes["email"])
            taken = await self.users.get_by_email(email)

            if taken is not None and taken.id != user.id:
                raise EmailAlreadyTakenError(email)

            changes["email"] = email

        for field, value in changes.items():
            setattr(user, field, value.strip() if isinstance(value, str) else value)

        return await self.users.save(user)
