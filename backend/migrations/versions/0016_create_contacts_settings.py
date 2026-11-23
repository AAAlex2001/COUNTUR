"""Create editable contacts and operator details.

Revision ID: 0016
Revises: 0015
"""

from alembic import op
import sqlalchemy as sa

revision = "0016"
down_revision = "0015"
branch_labels = None
depends_on = None


def upgrade() -> None:
    contacts = op.create_table(
        "contacts_settings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("eyebrow", sa.String(100), nullable=False),
        sa.Column("title", sa.String(150), nullable=False),
        sa.Column("description", sa.String(500), nullable=False),
        sa.Column("phone", sa.String(40), nullable=False),
        sa.Column("phone_label", sa.String(100), nullable=False),
        sa.Column("phone_description", sa.String(300), nullable=False),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("email_label", sa.String(100), nullable=False),
        sa.Column("email_description", sa.String(300), nullable=False),
        sa.Column("show_location", sa.Boolean(), nullable=False),
        sa.Column("location_title", sa.String(150), nullable=False),
        sa.Column("store_address", sa.String(300), nullable=False),
        sa.Column("hours", sa.String(200), nullable=False),
        sa.Column("directions", sa.String(500), nullable=False),
        sa.Column("show_map", sa.Boolean(), nullable=False),
        sa.Column("map_url", sa.String(2083), nullable=False),
        sa.Column("show_feedback", sa.Boolean(), nullable=False),
        sa.Column("feedback_title", sa.String(150), nullable=False),
        sa.Column("feedback_description", sa.String(500), nullable=False),
        sa.Column("show_documents", sa.Boolean(), nullable=False),
        sa.Column("documents_title", sa.String(150), nullable=False),
        sa.Column("show_requisites", sa.Boolean(), nullable=False),
        sa.Column("company_title", sa.String(150), nullable=False),
        sa.Column("operator_title", sa.String(150), nullable=False),
        sa.Column("operator_name", sa.String(200), nullable=False),
        sa.Column("inn", sa.String(12), nullable=False),
        sa.Column("ogrn", sa.String(15), nullable=False),
        sa.Column("legal_address", sa.String(300), nullable=False),
        sa.Column("operator_email", sa.String(254), nullable=False),
        sa.Column("operator_phone", sa.String(40), nullable=False),
        sa.Column("legal_contact", sa.String(300), nullable=False),
        sa.Column("operator_note", sa.String(500), nullable=False),
    )

    initial_settings = {
        "id": 1,
        "eyebrow": "Связь и поддержка",
        "title": "Контакты",
        "description": (
            "Свяжитесь с нами по вопросам заказа, доставки, гарантии или подбора комплектующих. "
            "Выберите удобный канал или оставьте сообщение."
        ),
        "phone": "8 800 555-01-90",
        "phone_label": "Телефон магазина",
        "phone_description": "Вопросы о товарах и заказах.",
        "email": "sohinaleksandr724@gmail.com",
        "email_label": "Электронная почта",
        "email_description": "Обращения в поддержку магазина.",
        "show_location": False,
        "location_title": "Адрес и режим работы",
        "store_address": "",
        "hours": "",
        "directions": "",
        "show_map": True,
        "map_url": "",
        "show_feedback": True,
        "feedback_title": "Напишите нам",
        "feedback_description": "Расскажите, с чем нужна помощь. Для вопроса по заказу укажите его номер.",
        "show_documents": True,
        "documents_title": "Документы магазина",
        "show_requisites": True,
        "company_title": "Реквизиты компании",
        "operator_title": "Контакты оператора",
        "operator_name": "",
        "inn": "",
        "ogrn": "",
        "legal_address": "",
        "operator_email": "",
        "operator_phone": "",
        "legal_contact": "",
        "operator_note": "",
    }

    op.bulk_insert(contacts, [initial_settings])


def downgrade() -> None:
    op.drop_table("contacts_settings")
