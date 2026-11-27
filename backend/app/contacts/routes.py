from fastapi import APIRouter, Depends

from app.contacts.dependencies import get_store_contacts_usecase
from app.contacts.schemas import ContactsSettingsSchema
from app.contacts.usecases.get_store_contacts import GetStoreContactsUseCase

router = APIRouter(prefix="/contacts", tags=["contacts"])


@router.get("")
async def get_contacts(
    usecase: GetStoreContactsUseCase = Depends(get_store_contacts_usecase),
) -> ContactsSettingsSchema:
    """Показать контакты магазина."""

    return await usecase.execute()
