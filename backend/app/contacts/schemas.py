from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator, validate_email


class ContactsSettingsSchema(BaseModel):
    """Поля страницы контактов и реквизиты оператора."""

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)

    eyebrow: str = Field(max_length=100)
    title: str = Field(max_length=150)
    description: str = Field(max_length=500)

    phone: str = Field(max_length=40)
    phone_label: str = Field(max_length=100)
    phone_description: str = Field(max_length=300)
    email: str = Field(max_length=254)
    email_label: str = Field(max_length=100)
    email_description: str = Field(max_length=300)

    show_location: bool
    location_title: str = Field(max_length=150)
    store_address: str = Field(max_length=300)
    hours: str = Field(max_length=200)
    directions: str = Field(max_length=500)
    show_map: bool
    map_url: str = Field(max_length=2083)

    show_feedback: bool
    feedback_title: str = Field(max_length=150)
    feedback_description: str = Field(max_length=500)
    show_documents: bool
    documents_title: str = Field(max_length=150)

    show_requisites: bool
    company_title: str = Field(max_length=150)
    operator_title: str = Field(max_length=150)
    operator_name: str = Field(max_length=200)
    inn: str = Field(max_length=12)
    ogrn: str = Field(max_length=15)
    legal_address: str = Field(max_length=300)
    operator_email: str = Field(max_length=254)
    operator_phone: str = Field(max_length=40)
    legal_contact: str = Field(max_length=300)
    operator_note: str = Field(max_length=500)

    @field_validator("email", "operator_email")
    @classmethod
    def validate_contact_email(cls, address: str) -> str:
        """Нормализует заполненный адрес электронной почты."""

        if not address:
            return address

        _, email = validate_email(address)
        return email

    @field_validator("map_url")
    @classmethod
    def validate_map_url(cls, address: str) -> str:
        """Проверяет HTTP-ссылку на карту, если она указана."""

        if not address:
            return address

        return str(HttpUrl(address))
