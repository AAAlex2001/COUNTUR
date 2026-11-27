"""Добавляет подписки покупателей на поступление товара."""

import sqlalchemy as sa
from alembic import op

revision = "0019"
down_revision = "0018"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Создаёт таблицу активных подписок."""

    op.create_table(
        "stock_subscriptions",
        sa.Column(
            "product_id",
            sa.Integer,
            sa.ForeignKey("products.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
        ),
        sa.Column(
            "next_attempt_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_index("ix_stock_subscriptions_user_id", "stock_subscriptions", ["user_id"])


def downgrade() -> None:
    """Удаляет подписки на поступление."""

    op.drop_table("stock_subscriptions")
