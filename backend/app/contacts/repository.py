from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.contacts.models import ContactsSettings

CONTACTS_SETTINGS_ID = 1


class ContactsSettingsRepository:
    """Настройки контактов магазина."""

    def __init__(self, db: AsyncSession) -> None:
        """Подключить сессию базы."""

        self.db = db

    async def get(self) -> ContactsSettings:
        """Получить контакты магазина."""

        query = select(ContactsSettings).where(ContactsSettings.id == CONTACTS_SETTINGS_ID)
        result = await self.db.execute(query)
        return result.scalar_one()

    async def save(self, settings: ContactsSettings) -> ContactsSettings:
        """Сохранить контакты магазина."""

        await self.db.commit()
        return settings
