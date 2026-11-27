from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


async def lock_unique_value(db: AsyncSession, field: str, value: str) -> None:
    """Зарезервировать значение до записи."""

    lock = func.pg_advisory_xact_lock(func.hashtext(field), func.hashtext(value))
    await db.execute(select(lock))
