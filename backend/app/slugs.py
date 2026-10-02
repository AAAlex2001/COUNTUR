"""Адреса (slug) для категорий, брендов, товаров и подборок."""

from typing import Any

from slugify import slugify
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


def make_slug(text: str) -> str:
    """Составить slug из названия: «Блоки питания» → «bloki-pitaniia»."""

    return slugify(text) or "item"


async def unique_slug(
    db: AsyncSession, model: Any, wanted: str, exclude_id: int | None = None
) -> str:
    """Вернуть wanted, если такого slug нет, иначе добавить суффикс -2, -3, ..."""

    slug = wanted
    suffix = 2

    while True:
        stmt = select(model.id).where(model.slug == slug)
        if exclude_id is not None:
            stmt = stmt.where(model.id != exclude_id)

        taken = await db.scalar(stmt)
        if taken is None:
            return slug

        slug = f"{wanted}-{suffix}"
        suffix += 1
