"""add public offer document

Стартовая заготовка договора оферты, дальше текст правится в админке.

Revision ID: 0014
Revises: 0013
Create Date: 2026-11-13
"""

from html import escape
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0014"
down_revision: Union[str, None] = "0013"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

SECTIONS = [
    (
        "Общие положения",
        "Договор является публичной офертой интернет-магазина COUNTUR. Оформляя заказ на сайте, "
        "покупатель принимает его условия полностью.",
    ),
    ("Предмет договора", "Продавец передаёт товар в собственность покупателя, а покупатель оплачивает и принимает его."),
    ("Оформление заказа", "[Как оформляется и подтверждается заказ]"),
    ("Цена и оплата", "[Валюта, способы и сроки оплаты]"),
    ("Доставка и получение", "[Способы, сроки и стоимость доставки, самовывоз]"),
    ("Возврат и обмен", "[Порядок и сроки возврата товара надлежащего и ненадлежащего качества]"),
    ("Ответственность сторон", "[Положения об ответственности и порядке разрешения споров]"),
    ("Реквизиты продавца", "[Наименование, ИНН, ОГРН, адрес, контакты]"),
]

CONTENT = "".join(f"<h2>{escape(title)}</h2><p>{escape(text)}</p>" for title, text in SECTIONS)


def upgrade() -> None:
    bind = op.get_bind()
    exists = bind.execute(sa.text("SELECT 1 FROM documents WHERE slug = 'offer'")).scalar()
    if exists:
        return

    bind.execute(
        sa.text(
            "INSERT INTO documents (slug, title, description, content) "
            "VALUES (:slug, :title, :description, :content)"
        ),
        {
            "slug": "offer",
            "title": "Договор публичной оферты",
            "description": "Условия покупки товаров в магазине COUNTUR: заказ, оплата, доставка и возврат.",
            "content": CONTENT,
        },
    )


def downgrade() -> None:
    op.execute("DELETE FROM documents WHERE slug = 'offer'")
