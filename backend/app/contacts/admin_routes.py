from fastapi import APIRouter, Depends

from app.admin.dependencies import require_admin
from app.contacts.dependencies import get_contacts_repository, get_update_contacts_usecase
from app.contacts.repository import ContactsSettingsRepository
from app.contacts.schemas import ContactsSettingsSchema
from app.contacts.usecases.update_contacts import UpdateContactsUseCase

router = APIRouter(
    prefix="/admin/contacts",
    tags=["admin: contacts"],
    dependencies=[Depends(require_admin)],
)


@router.get("")
async def get_contacts(
    contacts: ContactsSettingsRepository = Depends(get_contacts_repository),
) -> ContactsSettingsSchema:
    """Открыть настройки контактов."""

    settings = await contacts.get()
    return ContactsSettingsSchema.model_validate(settings)


@router.put("")
async def update_contacts(
    payload: ContactsSettingsSchema,
    usecase: UpdateContactsUseCase = Depends(get_update_contacts_usecase),
) -> ContactsSettingsSchema:
    """Сохранить настройки контактов."""

    settings = await usecase.execute(payload)
    return ContactsSettingsSchema.model_validate(settings)
