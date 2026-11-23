"""Create editable content for the landing hero.

Revision ID: 0015
Revises: 0014
"""

from alembic import op
import sqlalchemy as sa

revision = "0015"
down_revision = "0014"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "landing_hero_content",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("is_visible", sa.Boolean(), nullable=False),
        sa.Column("overline", sa.String(100), nullable=False),
        sa.Column("title", sa.String(150), nullable=False),
        sa.Column("description", sa.String(500), nullable=False),
        sa.Column("catalog_button_label", sa.String(60), nullable=False),
        sa.Column("support_button_label", sa.String(60), nullable=False),
        sa.Column("image_alt", sa.String(150), nullable=False),
        sa.Column("image_badge", sa.String(60), nullable=False),
        sa.Column("statistics", sa.JSON(), nullable=False),
    )
    op.execute(
        """
        INSERT INTO landing_hero_content (
            id, is_visible, overline, title, description, catalog_button_label,
            support_button_label, image_alt, image_badge, statistics
        )
        VALUES (
            1,
            TRUE,
            'Комплектующие / Сборка / Поддержка',
            'Соберите ПК мечты сегодня',
            'Более 5 000 комплектующих от ведущих производителей. Гарантия, быстрая доставка, помощь в сборке.',
            'Перейти в каталог',
            'Помощь в сборке',
            'Игровой компьютер с подсветкой',
            'Сборка готова к игре',
            '[{"value": "5 000+", "label": "Товаров"},
              {"value": "3 года", "label": "Гарантия"},
              {"value": "24 часа", "label": "Доставка"}]'
        )
        """
    )
    op.execute(
        "INSERT INTO landing_hero (id) SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM landing_hero)"
    )


def downgrade() -> None:
    op.drop_table("landing_hero_content")
