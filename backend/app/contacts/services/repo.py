from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.contacts.models import ContactsSettings

CONTACTS_SETTINGS_ID = 1


class ContactsSettingsRepository:
    """Читает и сохраняет единственную запись контактов магазина."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self) -> ContactsSettings:
        """Возвращает запись, созданную миграцией настроек."""

        query = select(ContactsSettings).where(ContactsSettings.id == CONTACTS_SETTINGS_ID)
        result = await self.db.execute(query)
        return result.scalar_one()

    async def save(self, settings: ContactsSettings) -> ContactsSettings:
        """Фиксирует изменения контактов в базе."""

        await self.db.commit()
        return settings
