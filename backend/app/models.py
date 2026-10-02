"""Все модели приложения в одном месте, чтобы их видели Alembic и SQLAlchemy."""

from app.admin.models import Admin
from app.cart.models import CartItem
from app.catalog.models import (
    Attribute,
    Brand,
    Category,
    Product,
    ProductImage,
    ProductSpec,
    Review,
)
from app.collections.models import Collection, collection_products
from app.database import Base
from app.favorites.models import Favorite
from app.orders.models import Order, OrderItem

__all__ = [
    "Base",
    "Admin",
    "CartItem",
    "Attribute",
    "Brand",
    "Category",
    "Product",
    "ProductImage",
    "ProductSpec",
    "Review",
    "Collection",
    "collection_products",
    "Favorite",
    "Order",
    "OrderItem",
]
