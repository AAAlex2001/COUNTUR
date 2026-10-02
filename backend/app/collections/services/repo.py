"""Репозиторий подборок: только запросы к таблице collections."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.collections.models import Collection
from app.slugs import unique_slug


class CollectionRepository:
    """Доступ к таблице collections. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_active(self, placement: str | None) -> list[Collection]:
        """Включённые подборки по порядку. placement: home или catalog."""

        stmt = (
            select(Collection)
            .where(Collection.is_active.is_(True))
            .order_by(Collection.sort_order, Collection.title)
        )

        if placement == "home":
            stmt = stmt.where(Collection.show_on_home.is_(True))

        if placement == "catalog":
            stmt = stmt.where(Collection.show_in_catalog.is_(True))

        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_active(self, slug: str) -> Collection | None:
        """Включённая подборка по slug. Выключенная считается ненайденной."""

        stmt = select(Collection).where(Collection.slug == slug, Collection.is_active.is_(True))
        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def list_all(self) -> list[Collection]:
        """Все подборки для админки, включая выключенные."""

        stmt = select(Collection).order_by(Collection.sort_order, Collection.title)
        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_by_id(self, collection_id: int) -> Collection | None:
        """Подборка по идентификатору или None."""

        return await self.db.get(Collection, collection_id)

    async def unique_slug(self, wanted: str, exclude_id: int | None = None) -> str:
        """Свободный slug подборки на основе wanted."""

        return await unique_slug(self.db, Collection, wanted, exclude_id)

    async def add(self, collection: Collection) -> Collection:
        """Сохранить новую подборку и вернуть её перечитанной из базы."""

        self.db.add(collection)
        await self.db.commit()

        return await self.reload(collection.id)

    async def save(self, collection: Collection) -> Collection:
        """Сохранить изменения существующей подборки и вернуть её перечитанной."""

        await self.db.commit()

        return await self.reload(collection.id)

    async def delete(self, collection: Collection) -> None:
        """Удалить подборку. Сами товары остаются."""

        await self.db.delete(collection)
        await self.db.commit()

    async def reload(self, collection_id: int) -> Collection:
        """Перечитать подборку из базы после записи вместе с товарами."""

        stmt = (
            select(Collection)
            .where(Collection.id == collection_id)
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(stmt)

        return result.scalar_one()
