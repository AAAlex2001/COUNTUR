from app.contacts.models import ContactsSettings
from app.contacts.repository import ContactsSettingsRepository
from app.contacts.schemas import ContactsSettingsSchema


class UpdateContactsUseCase:
    """Настройки контактов."""

    def __init__(self, contacts: ContactsSettingsRepository) -> None:
        """Подключить настройки контактов."""

        self.contacts = contacts

    async def execute(self, payload: ContactsSettingsSchema) -> ContactsSettings:
        """Сохранить страницу контактов."""

        settings = await self.contacts.get()

        apply_store_contacts(settings, payload)
        apply_location(settings, payload)
        apply_sections(settings, payload)
        apply_operator(settings, payload)

        return await self.contacts.save(settings)


def apply_store_contacts(settings: ContactsSettings, fields: ContactsSettingsSchema) -> None:
    """Обновить контакты магазина."""

    settings.eyebrow = fields.eyebrow
    settings.title = fields.title
    settings.description = fields.description
    settings.phone = fields.phone
    settings.phone_label = fields.phone_label
    settings.phone_description = fields.phone_description
    settings.email = fields.email
    settings.email_label = fields.email_label
    settings.email_description = fields.email_description


def apply_location(settings: ContactsSettings, fields: ContactsSettingsSchema) -> None:
    """Обновить расположение магазина."""

    settings.show_location = fields.show_location
    settings.location_title = fields.location_title
    settings.store_address = fields.store_address
    settings.hours = fields.hours
    settings.directions = fields.directions
    settings.show_map = fields.show_map
    settings.map_url = fields.map_url


def apply_sections(settings: ContactsSettings, fields: ContactsSettingsSchema) -> None:
    """Обновить разделы страницы."""

    settings.show_feedback = fields.show_feedback
    settings.feedback_title = fields.feedback_title
    settings.feedback_description = fields.feedback_description
    settings.show_documents = fields.show_documents
    settings.documents_title = fields.documents_title
    settings.show_requisites = fields.show_requisites
    settings.company_title = fields.company_title


def apply_operator(settings: ContactsSettings, fields: ContactsSettingsSchema) -> None:
    """Обновить реквизиты оператора."""

    settings.operator_title = fields.operator_title
    settings.operator_name = fields.operator_name
    settings.inn = fields.inn
    settings.ogrn = fields.ogrn
    settings.legal_address = fields.legal_address
    settings.operator_email = fields.operator_email
    settings.operator_phone = fields.operator_phone
    settings.legal_contact = fields.legal_contact
    settings.operator_note = fields.operator_note
