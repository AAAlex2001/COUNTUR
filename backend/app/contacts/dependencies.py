from app.contacts.repository import ContactsSettingsRepository
from app.contacts.usecases.get_store_contacts import GetStoreContactsUseCase
from app.contacts.usecases.update_contacts import UpdateContactsUseCase
from app.database import DatabaseSession


def get_contacts_repository(db: DatabaseSession) -> ContactsSettingsRepository:
    """Открыть настройки контактов."""

    return ContactsSettingsRepository(db=db)


def get_store_contacts_usecase(db: DatabaseSession) -> GetStoreContactsUseCase:
    """Подготовить контакты витрины."""

    return GetStoreContactsUseCase(contacts=ContactsSettingsRepository(db=db))


def get_update_contacts_usecase(db: DatabaseSession) -> UpdateContactsUseCase:
    """Подготовить обновление контактов."""

    return UpdateContactsUseCase(contacts=ContactsSettingsRepository(db=db))
