from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.contacts.services.repo import ContactsSettingsRepository
from app.contacts.services.usecases.update_contacts import UpdateContactsUseCase
from app.database import get_session


def get_contacts_repository(
    session: AsyncSession = Depends(get_session),
) -> ContactsSettingsRepository:
    """Связывает настройки контактов с сессией запроса."""

    return ContactsSettingsRepository(session)


def get_update_contacts_usecase(
    contacts: ContactsSettingsRepository = Depends(get_contacts_repository),
) -> UpdateContactsUseCase:
    """Готовит сохранение страницы контактов."""

    return UpdateContactsUseCase(contacts)
