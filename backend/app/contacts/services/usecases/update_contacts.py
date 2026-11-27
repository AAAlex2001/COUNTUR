from app.contacts.models import ContactsSettings
from app.contacts.schemas import ContactsSettingsSchema
from app.contacts.services.repo import ContactsSettingsRepository


class UpdateContactsUseCase:
    """Сохраняет страницу контактов и реквизиты оператора."""

    def __init__(self, contacts: ContactsSettingsRepository) -> None:
        self.contacts = contacts

    async def execute(self, payload: ContactsSettingsSchema) -> ContactsSettings:
        """Применяет настройки всех разделов за одну транзакцию."""

        settings = await self.contacts.get()
        for field, value in payload.model_dump().items():
            setattr(settings, field, value)

        return await self.contacts.save(settings)
