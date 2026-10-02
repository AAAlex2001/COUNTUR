"""create cart and favorites tables

Revision ID: 0003
Revises: 0002
Create Date: 2026-10-02
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "cart_items",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("visitor_id", sa.String(length=36), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("visitor_id", "product_id", name="uq_cart_items_visitor_product"),
        sa.CheckConstraint("quantity > 0", name="ck_cart_items_quantity"),
    )
    op.create_index("ix_cart_items_visitor_id", "cart_items", ["visitor_id"])

    op.create_table(
        "favorites",
        sa.Column("visitor_id", sa.String(length=36), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("visitor_id", "product_id"),
    )


def downgrade() -> None:
    op.drop_table("favorites")
    op.drop_index("ix_cart_items_visitor_id", table_name="cart_items")
    op.drop_table("cart_items")
