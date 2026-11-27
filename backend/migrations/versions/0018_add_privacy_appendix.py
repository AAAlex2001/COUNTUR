"""Добавить приложение к политике конфиденциальности."""

from pathlib import Path

import sqlalchemy as sa
from alembic import op

revision = "0018"
down_revision = "0017"
branch_labels = None
depends_on = None

CONTENT = Path(__file__).resolve().parents[1] / "data" / "0018_privacy_appendix.html"
SLUG = "privacy-appendix-1"


def upgrade() -> None:
    """Опубликовать приложение."""

    op.get_bind().execute(
        sa.text(
            "INSERT INTO documents (slug, title, description, content) "
            "VALUES (:slug, :title, '', :content) ON CONFLICT (slug) DO NOTHING"
        ),
        {
            "slug": SLUG,
            "title": "Приложение № 1 к политике конфиденциальности",
            "content": CONTENT.read_text(encoding="utf-8").strip(),
        },
    )


def downgrade() -> None:
    """Удалить приложение."""

    op.execute("DELETE FROM documents WHERE slug = 'privacy-appendix-1'")
