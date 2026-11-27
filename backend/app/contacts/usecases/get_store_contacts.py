from app.contacts.repository import ContactsSettingsRepository
from app.contacts.schemas import ContactsSettingsSchema


class GetStoreContactsUseCase:
    """Контакты витрины."""

    def __init__(self, contacts: ContactsSettingsRepository) -> None:
        """Подключить настройки контактов."""

        self.contacts = contacts

    async def execute(self) -> ContactsSettingsSchema:
        """Получить опубликованные контакты."""

        settings = await self.contacts.get()
        public = ContactsSettingsSchema.model_validate(settings)

        if not public.show_location:
            public.location_title = ""
            public.store_address = ""
            public.hours = ""
            public.directions = ""

        if not public.show_location or not public.show_map:
            public.map_url = ""

        return public
