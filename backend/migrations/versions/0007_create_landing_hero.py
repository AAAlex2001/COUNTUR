"""create landing_hero table

Revision ID: 0007
Revises: 0006
Create Date: 2026-10-02
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0007"
down_revision: Union[str, None] = "0006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "landing_hero",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("image_path", sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("landing_hero")
