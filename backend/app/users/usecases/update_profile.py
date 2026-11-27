from app.users.models import User
from app.users.repository import UserRepository
from app.users.schemas import UserUpdateSchema
from app.users.validators import normalize_email


class UpdateProfileUseCase:
    """Профиль покупателя."""

    def __init__(self, users: UserRepository) -> None:
        """Подключить покупателей."""

        self.users = users

    async def execute(self, user: User, payload: UserUpdateSchema) -> User:
        """Обновить профиль покупателя."""

        if payload.name is not None:
            user.name = payload.name
        if payload.email is not None:
            user.email = normalize_email(payload.email)
        if "last_name" in payload.model_fields_set:
            user.last_name = payload.last_name
        if "phone" in payload.model_fields_set:
            user.phone = payload.phone
        if "address" in payload.model_fields_set:
            user.address = payload.address
        if payload.notify_orders is not None:
            user.notify_orders = payload.notify_orders
        if payload.notify_promo is not None:
            user.notify_promo = payload.notify_promo

        return await self.users.save(user)
