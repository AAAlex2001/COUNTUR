"""Добавляет адресатов ответов бота поддержки."""

from alembic import op
import sqlalchemy as sa

revision = "0017"
down_revision = "0016"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Создаёт таблицу для открытых заявок и номеров закрытых."""

    op.create_table(
        "telegram_replies",
        sa.Column("request_id", sa.String(32), primary_key=True),
        sa.Column("chat_id", sa.BigInteger(), nullable=True),
    )


def downgrade() -> None:
    """Удаляет таблицу адресатов Telegram."""

    op.drop_table("telegram_replies")
