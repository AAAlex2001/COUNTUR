from asyncpg.exceptions import UniqueViolationError
from sqlalchemy import ColumnElement, delete, func, or_, select, true, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.models import AuthSession
from app.tokens import TokenRole
from app.users.exceptions import EmailAlreadyTakenError
from app.users.models import User


def matches_search(search: str | None) -> ColumnElement[bool]:
    """Найти совпадения в профиле."""

    if not search:
        return true()

    return or_(
        User.name.icontains(search, autoescape=True),
        User.last_name.icontains(search, autoescape=True),
        User.email.icontains(search, autoescape=True),
    )


class UserRepository:
    """Покупатели."""

    def __init__(self, db: AsyncSession) -> None:
        """Подключить сессию базы."""

        self.db = db

    async def get_by_id(self, user_id: int) -> User | None:
        """Найти покупателя по номеру."""

        return await self.db.get(User, user_id)

    async def get_by_email(self, email: str) -> User | None:
        """Найти покупателя по почте."""

        return await self.db.scalar(select(User).where(User.email == email))

    async def list_users(self, search: str | None, limit: int, offset: int) -> list[User]:
        """Получить список покупателей."""

        users = await self.db.scalars(
            select(User)
            .where(matches_search(search))
            .order_by(User.created_at.desc(), User.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(users)

    async def count_users(self, search: str | None) -> int:
        """Посчитать найденных покупателей."""

        query = select(func.count()).select_from(User).where(matches_search(search))
        return await self.db.scalar(query) or 0

    async def save(self, user: User) -> User:
        """Сохранить покупателя."""

        self.db.add(user)
        try:
            await self.db.commit()
        except IntegrityError as error:
            await self.db.rollback()
            cause = error.orig.__cause__
            if (
                isinstance(cause, UniqueViolationError)
                and cause.constraint_name == "users_email_key"
            ):
                raise EmailAlreadyTakenError("На этот email уже есть аккаунт") from error
            raise

        return user

    async def replace_password(self, user: User, password_hash: str) -> bool:
        """Заменить проверенный пароль."""

        changed = await self.db.scalar(
            update(User)
            .where(User.id == user.id, User.password_hash == user.password_hash)
            .values(password_hash=password_hash)
            .returning(User.id)
        )
        if changed is None:
            await self.db.rollback()
            return False

        await self.db.execute(
            delete(AuthSession).where(
                AuthSession.subject == str(user.id),
                AuthSession.role == TokenRole.CUSTOMER.value,
            )
        )
        await self.db.commit()
        return True
