"""create landing_promotion table

Revision ID: 0008
Revises: 0007
Create Date: 2026-10-02
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0008"
down_revision: Union[str, None] = "0007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "landing_promotion",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("label", sa.String(length=100), nullable=False),
        sa.Column("title", sa.String(length=150), nullable=False),
        sa.Column("text", sa.String(length=300), nullable=False),
        sa.Column("button_label", sa.String(length=60), nullable=False),
        sa.Column("button_url", sa.String(length=255), nullable=False),
        sa.Column("image_path", sa.String(length=255), nullable=True),
        sa.Column("is_visible", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("landing_promotion")
