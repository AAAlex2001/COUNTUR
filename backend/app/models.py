"""Все модели приложения в одном месте, чтобы их видели Alembic и SQLAlchemy."""

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
from app.feedback.models import FeedbackMessage
from app.landing.models import Hero, Promotion
from app.orders.models import Order, OrderItem
from app.users.models import User

__all__ = [
    "Base",
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
    "FeedbackMessage",
    "Hero",
    "Promotion",
    "Order",
    "OrderItem",
    "User",
]
