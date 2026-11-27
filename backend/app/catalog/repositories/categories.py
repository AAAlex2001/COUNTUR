from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import Attribute, Category, Product, PublicationStatus
from app.locks import lock_unique_value
from app.slugs import unique_slug


class CategoryRepository:
    """Доступ к таблицам categories и attributes. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_with_counts(self) -> list[tuple[Category, int]]:
        """Все категории по порядку и число опубликованных товаров в каждой."""

        stmt = (
            select(Category, func.count(Product.id))
            .outerjoin(
                Product,
                and_(
                    Product.category_id == Category.id,
                    Product.status == PublicationStatus.PUBLISHED,
                ),
            )
            .group_by(Category.id)
            .order_by(Category.sort_order, Category.name)
        )
        result = await self.db.execute(stmt)

        return [(category, count) for category, count in result.all()]

    async def list_all(self) -> list[Category]:
        """Все категории по порядку вместе с параметрами."""

        stmt = select(Category).order_by(Category.sort_order, Category.name)
        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_by_id(self, category_id: int) -> Category | None:
        """Категория по идентификатору или None."""

        return await self.db.get(Category, category_id)

    async def get_by_slug(self, slug: str) -> Category | None:
        """Категория по адресу или None."""

        stmt = select(Category).where(Category.slug == slug)
        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def unique_slug(self, wanted: str, exclude_id: int | None = None) -> str:
        """Свободный slug категории на основе wanted."""

        return await unique_slug(self.db, Category, wanted, exclude_id)

    async def has_products(self, category_id: int) -> bool:
        """Есть ли в категории хоть один товар, включая черновики."""

        stmt = select(Product.id).where(Product.category_id == category_id).limit(1)

        return await self.db.scalar(stmt) is not None

    async def get_attribute(self, attribute_id: int) -> Attribute | None:
        """Параметр категории по идентификатору или None."""

        return await self.db.get(Attribute, attribute_id)

    async def reserve_attribute_name(
        self, category_id: int, name: str, exclude_id: int | None = None
    ) -> bool:
        """Зарезервировать название параметра."""

        await lock_unique_value(self.db, f"categories.{category_id}.attribute", name)
        stmt = select(Attribute.id).where(
            Attribute.category_id == category_id, Attribute.name == name
        )
        if exclude_id is not None:
            stmt = stmt.where(Attribute.id != exclude_id)

        return await self.db.scalar(stmt) is None

    async def add(self, category: Category) -> Category:
        """Сохранить новую категорию и вернуть её перечитанной из базы."""

        self.db.add(category)
        await self.db.commit()

        return await self.reload(category.id)

    async def add_attribute(self, attribute: Attribute) -> Category:
        """Добавить параметр и вернуть его категорию перечитанной."""

        self.db.add(attribute)
        await self.db.commit()

        return await self.reload(attribute.category_id)

    async def save(self, category_id: int) -> Category:
        """Сохранить изменения категории или её параметров и вернуть её перечитанной."""

        await self.db.commit()

        return await self.reload(category_id)

    async def delete(self, category: Category) -> None:
        """Удалить категорию. Её параметры удаляются вместе с ней."""

        await self.db.delete(category)
        await self.db.commit()

    async def delete_attribute(self, attribute: Attribute) -> None:
        """Удалить параметр. Его значения у товаров база удаляет каскадом."""

        await self.db.delete(attribute)
        await self.db.commit()

    async def reload(self, category_id: int) -> Category:
        """Перечитать категорию из базы после записи вместе с параметрами."""

        stmt = (
            select(Category)
            .where(Category.id == category_id)
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(stmt)

        return result.scalar_one()
