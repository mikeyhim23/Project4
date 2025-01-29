"""add full crud fuctionalities to taskresource

Revision ID: 71523aabac0d
Revises: 7665ca8bd26f
Create Date: 2025-01-29 10:25:53.896970

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '71523aabac0d'
down_revision = '7665ca8bd26f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_task', schema=None) as batch_op:
        batch_op.add_column(sa.Column('role', sa.String(length=50), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_task', schema=None) as batch_op:
        batch_op.drop_column('role')

    # ### end Alembic commands ###
