"""Сценарии работы с брендами."""

from app.catalog.models import Brand
from app.catalog.schemas import BrandCreateSchema, BrandUpdateSchema
from app.catalog.services.repo import BrandRepository
from app.slugs import make_slug


class CreateBrandUseCase:
    """Создать бренд. Без slug он составляется из названия."""

    def __init__(self, brands: BrandRepository) -> None:
        self.brands = brands

    async def execute(self, payload: BrandCreateSchema) -> Brand:
        """Вернуть сохранённый бренд."""

        slug = await self.brands.unique_slug(payload.slug or make_slug(payload.name))

        return await self.brands.add(Brand(slug=slug, name=payload.name))


class UpdateBrandUseCase:
    """Изменить название или адрес бренда."""

    def __init__(self, brands: BrandRepository) -> None:
        self.brands = brands

    async def execute(self, brand: Brand, payload: BrandUpdateSchema) -> Brand:
        """Вернуть обновлённый бренд."""

        changes = payload.model_dump(exclude_unset=True, exclude_none=True)

        if "slug" in changes:
            changes["slug"] = await self.brands.unique_slug(changes["slug"], exclude_id=brand.id)

        for field, value in changes.items():
            setattr(brand, field, value)

        return await self.brands.save(brand)
