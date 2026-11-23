from app.contacts.models import ContactsSettings
from app.contacts.schemas import ContactsSettingsSchema
from app.contacts.services.repo import ContactsSettingsRepository


class UpdateContactsUseCase:
    """Сохраняет страницу контактов и реквизиты оператора."""

    def __init__(self, contacts: ContactsSettingsRepository) -> None:
        self.contacts = contacts

    async def execute(self, payload: ContactsSettingsSchema) -> ContactsSettings:
        settings = await self.contacts.get()

        settings.eyebrow = payload.eyebrow
        settings.title = payload.title
        settings.description = payload.description

        settings.phone = payload.phone
        settings.phone_label = payload.phone_label
        settings.phone_description = payload.phone_description
        settings.email = payload.email
        settings.email_label = payload.email_label
        settings.email_description = payload.email_description

        settings.show_location = payload.show_location
        settings.location_title = payload.location_title
        settings.store_address = payload.store_address
        settings.hours = payload.hours
        settings.directions = payload.directions
        settings.show_map = payload.show_map
        settings.map_url = payload.map_url

        settings.show_feedback = payload.show_feedback
        settings.feedback_title = payload.feedback_title
        settings.feedback_description = payload.feedback_description
        settings.show_documents = payload.show_documents
        settings.documents_title = payload.documents_title

        settings.show_requisites = payload.show_requisites
        settings.company_title = payload.company_title
        settings.operator_title = payload.operator_title
        settings.operator_name = payload.operator_name
        settings.inn = payload.inn
        settings.ogrn = payload.ogrn
        settings.legal_address = payload.legal_address
        settings.operator_email = payload.operator_email
        settings.operator_phone = payload.operator_phone
        settings.legal_contact = payload.legal_contact
        settings.operator_note = payload.operator_note

        return await self.contacts.save(settings)
