"""Добавляет очередь писем по заказам и трек-номер отправления."""

import sqlalchemy as sa
from alembic import op

revision = "0020"
down_revision = "0019"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Создать очередь для событий после обновления магазина."""

    op.add_column("orders", sa.Column("tracking_number", sa.String(100)))
    op.add_column("orders", sa.Column("payment_method", sa.String(20)))
    op.create_table(
        "order_mail",
        sa.Column(
            "order_id", sa.Integer, sa.ForeignKey("orders.id", ondelete="CASCADE"), primary_key=True
        ),
        sa.Column("kind", sa.String(20), primary_key=True),
        sa.Column("reference", sa.String(100), primary_key=True),
        sa.Column(
            "next_attempt_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("sent_at", sa.DateTime(timezone=True)),
    )
    op.create_index(
        "ix_order_mail_pending",
        "order_mail",
        ["next_attempt_at"],
        postgresql_where=sa.text("sent_at IS NULL"),
    )


def downgrade() -> None:
    """Удалить очередь и дополнительные поля заказов."""

    op.drop_table("order_mail")
    op.drop_column("orders", "payment_method")
    op.drop_column("orders", "tracking_number")
