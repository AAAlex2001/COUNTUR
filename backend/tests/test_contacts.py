"""Проверки редактирования контактов и публикации геолокации."""

import asyncio
from unittest.mock import AsyncMock

import pytest

from app.contacts.models import ContactsSettings
from app.contacts.schemas import ContactsSettingsSchema
from app.contacts.usecases.get_store_contacts import GetStoreContactsUseCase
from app.contacts.usecases.update_contacts import UpdateContactsUseCase


@pytest.fixture
def fields() -> ContactsSettingsSchema:
    values = {
        name: True if field.annotation is bool else name
        for name, field in ContactsSettingsSchema.model_fields.items()
    }
    values.update(
        email="store@example.com",
        operator_email="operator@example.com",
        map_url="https://example.com/map",
    )
    return ContactsSettingsSchema.model_validate(values)


def test_editor_saves_every_section(fields):
    settings = ContactsSettings()
    repository = AsyncMock()
    repository.get.return_value = settings
    repository.save.return_value = settings

    saved = asyncio.run(UpdateContactsUseCase(repository).execute(fields))

    assert ContactsSettingsSchema.model_validate(saved) == fields
    repository.save.assert_awaited_once_with(settings)


@pytest.mark.parametrize(
    ("location", "map_visible", "expected_address", "expected_map"),
    [
        (False, True, "", ""),
        (True, False, "store_address", ""),
        (True, True, "store_address", "https://example.com/map"),
    ],
)
def test_visibility_only_affects_public_copy(
    fields, location, map_visible, expected_address, expected_map
):
    fields.show_location = location
    fields.show_map = map_visible
    settings = ContactsSettings()
    for name in ContactsSettingsSchema.model_fields:
        setattr(settings, name, getattr(fields, name))

    repository = AsyncMock()
    repository.get.return_value = settings
    public = asyncio.run(GetStoreContactsUseCase(repository).execute())

    assert public.store_address == expected_address
    assert public.map_url == expected_map
    assert ContactsSettingsSchema.model_validate(settings) == fields
