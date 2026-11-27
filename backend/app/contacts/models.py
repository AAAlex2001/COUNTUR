from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ContactsSettings(Base):
    """Контакты магазина и оператора."""

    __tablename__ = "contacts_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    eyebrow: Mapped[str] = mapped_column(String(100))
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[str] = mapped_column(String(500))

    phone: Mapped[str] = mapped_column(String(40))
    phone_label: Mapped[str] = mapped_column(String(100))
    phone_description: Mapped[str] = mapped_column(String(300))
    email: Mapped[str] = mapped_column(String(254))
    email_label: Mapped[str] = mapped_column(String(100))
    email_description: Mapped[str] = mapped_column(String(300))

    show_location: Mapped[bool] = mapped_column(Boolean)
    location_title: Mapped[str] = mapped_column(String(150))
    store_address: Mapped[str] = mapped_column(String(300))
    hours: Mapped[str] = mapped_column(String(200))
    directions: Mapped[str] = mapped_column(String(500))
    show_map: Mapped[bool] = mapped_column(Boolean)
    map_url: Mapped[str] = mapped_column(String(2083))

    show_feedback: Mapped[bool] = mapped_column(Boolean)
    feedback_title: Mapped[str] = mapped_column(String(150))
    feedback_description: Mapped[str] = mapped_column(String(500))
    show_documents: Mapped[bool] = mapped_column(Boolean)
    documents_title: Mapped[str] = mapped_column(String(150))

    show_requisites: Mapped[bool] = mapped_column(Boolean)
    company_title: Mapped[str] = mapped_column(String(150))
    operator_title: Mapped[str] = mapped_column(String(150))
    operator_name: Mapped[str] = mapped_column(String(200))
    inn: Mapped[str] = mapped_column(String(12))
    ogrn: Mapped[str] = mapped_column(String(15))
    legal_address: Mapped[str] = mapped_column(String(300))
    operator_email: Mapped[str] = mapped_column(String(254))
    operator_phone: Mapped[str] = mapped_column(String(40))
    legal_contact: Mapped[str] = mapped_column(String(300))
    operator_note: Mapped[str] = mapped_column(String(500))
