from fastapi import APIRouter, Depends

from app.contacts.dependencies import get_contacts_repository
from app.contacts.schemas import ContactsSettingsSchema
from app.contacts.services.repo import ContactsSettingsRepository

router = APIRouter(prefix="/contacts", tags=["contacts"])


@router.get("")
async def get_contacts(
    contacts: ContactsSettingsRepository = Depends(get_contacts_repository),
) -> ContactsSettingsSchema:
    """Возвращает покупателю опубликованные контактные данные."""

    settings = await contacts.get()
    response = ContactsSettingsSchema.model_validate(settings)

    if not response.show_location:
        response.location_title = ""
        response.store_address = ""
        response.hours = ""
        response.directions = ""

    if not response.show_location or not response.show_map:
        response.map_url = ""

    return response
