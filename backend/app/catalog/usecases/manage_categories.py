"""Сценарии работы с категориями и их параметрами."""

from app.catalog.exceptions import AttributeAlreadyExistsError, CategoryInUseError
from app.catalog.models import Attribute, Category
from app.catalog.repositories.categories import CategoryRepository
from app.catalog.schemas import (
    AttributeCreateSchema,
    AttributeUpdateSchema,
    CategoryCreateSchema,
    CategoryUpdateSchema,
)
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

        if payload.slug is not None:
            category.slug = await self.categories.unique_slug(payload.slug, exclude_id=category.id)
        if payload.name is not None:
            category.name = payload.name
        if payload.sort_order is not None:
            category.sort_order = payload.sort_order

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

        if not await self.categories.reserve_attribute_name(category.id, payload.name):
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

        if payload.name is not None:
            if not await self.categories.reserve_attribute_name(
                attribute.category_id, payload.name, exclude_id=attribute.id
            ):
                raise AttributeAlreadyExistsError(payload.name)
            attribute.name = payload.name
        if payload.group is not None:
            attribute.group = payload.group
        if payload.is_filterable is not None:
            attribute.is_filterable = payload.is_filterable
        if payload.sort_order is not None:
            attribute.sort_order = payload.sort_order

        return await self.categories.save(attribute.category_id)
