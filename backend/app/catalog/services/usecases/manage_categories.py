"""Сценарии работы с категориями и их параметрами."""

from app.catalog.models import Attribute, Category
from app.catalog.schemas import (
    AttributeCreateSchema,
    AttributeUpdateSchema,
    CategoryCreateSchema,
    CategoryUpdateSchema,
)
from app.catalog.services.exceptions import AttributeAlreadyExistsError, CategoryInUseError
from app.catalog.services.repo import CategoryRepository
from app.slugs import make_slug


class CreateCategoryUseCase:
    """Создать категорию. Без slug он составляется из названия."""

    def __init__(self, categories: CategoryRepository) -> None:
        self.categories = categories

    async def execute(self, payload: CategoryCreateSchema) -> Category:
        """Вернуть сохранённую категорию."""

        slug = await self.categories.unique_slug(payload.slug or make_slug(payload.name))
        category = Category(slug=slug, name=payload.name, sort_order=payload.sort_order)

        return await self.categories.add(category)


class UpdateCategoryUseCase:
    """Изменить название, адрес или порядок категории."""

    def __init__(self, categories: CategoryRepository) -> None:
        self.categories = categories

    async def execute(self, category: Category, payload: CategoryUpdateSchema) -> Category:
        """Вернуть обновлённую категорию."""

        changes = payload.model_dump(exclude_unset=True, exclude_none=True)

        if "slug" in changes:
            changes["slug"] = await self.categories.unique_slug(
                changes["slug"], exclude_id=category.id
            )

        for field, value in changes.items():
            setattr(category, field, value)

        return await self.categories.save(category.id)


class DeleteCategoryUseCase:
    """Удалить пустую категорию."""

    def __init__(self, categories: CategoryRepository) -> None:
        self.categories = categories

    async def execute(self, category: Category) -> None:
        """Удалить категорию. Бросает CategoryInUseError, если в ней есть товары."""

        if await self.categories.has_products(category.id):
            raise CategoryInUseError(category.name)

        await self.categories.delete(category)


class CreateAttributeUseCase:
    """Добавить параметр в набор характеристик категории."""

    def __init__(self, categories: CategoryRepository) -> None:
        self.categories = categories

    async def execute(self, category: Category, payload: AttributeCreateSchema) -> Category:
        """Вернуть категорию с новым параметром. Бросает AttributeAlreadyExistsError."""

        if await self.categories.attribute_exists(category.id, payload.name):
            raise AttributeAlreadyExistsError(payload.name)

        attribute = Attribute(
            category_id=category.id,
            group=payload.group,
            name=payload.name,
            is_filterable=payload.is_filterable,
            sort_order=payload.sort_order,
        )

        return await self.categories.add_attribute(attribute)


class UpdateAttributeUseCase:
    """Изменить параметр категории."""

    def __init__(self, categories: CategoryRepository) -> None:
        self.categories = categories

    async def execute(self, attribute: Attribute, payload: AttributeUpdateSchema) -> Category:
        """Вернуть категорию с обновлённым параметром. Бросает AttributeAlreadyExistsError."""

        changes = payload.model_dump(exclude_unset=True, exclude_none=True)

        if "name" in changes and await self.categories.attribute_exists(
            attribute.category_id, changes["name"], exclude_id=attribute.id
        ):
            raise AttributeAlreadyExistsError(changes["name"])

        for field, value in changes.items():
            setattr(attribute, field, value)

        return await self.categories.save(attribute.category_id)
