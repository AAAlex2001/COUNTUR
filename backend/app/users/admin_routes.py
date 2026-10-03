from fastapi import APIRouter, Depends, Query

from app.admin.dependencies import require_admin
from app.cart.dependencies import get_cart_repository
from app.cart.schemas import CartPageSchema, build_cart_rows
from app.cart.services.repo import CartRepository
from app.catalog.schemas import ProductCardSchema, ProductListSchema
from app.favorites.dependencies import get_favorite_repository
from app.favorites.services.repo import FavoriteRepository
from app.orders.dependencies import get_order_repository
from app.orders.schemas import OrderAdminListSchema, OrderAdminSchema
from app.orders.services.repo import OrderRepository
from app.users.dependencies import get_user_by_id, get_user_repository
from app.users.models import User
from app.users.schemas import UserAdminListSchema, UserSchema
from app.users.services.repo import UserRepository

router = APIRouter(
    prefix="/admin/users",
    tags=["admin: users"],
    dependencies=[Depends(require_admin)],
)


@router.get("")
async def list_users(
    q: str | None = Query(None, max_length=100, description="Поиск по имени и email"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    users: UserRepository = Depends(get_user_repository),
) -> UserAdminListSchema:
    """Покупатели, новые первыми."""

    items, total = await users.list_all(q.strip() if q else None, limit, offset)

    return UserAdminListSchema(users=[UserSchema.model_validate(item) for item in items], total=total)


@router.get("/{user_id}")
async def get_user(user: User = Depends(get_user_by_id)) -> UserSchema:
    """Карточка покупателя."""

    return UserSchema.model_validate(user)


@router.get("/{user_id}/orders")
async def list_user_orders(
    limit: int = Query(10, ge=1, le=50),
    offset: int = Query(0, ge=0),
    user: User = Depends(get_user_by_id),
    orders: OrderRepository = Depends(get_order_repository),
) -> OrderAdminListSchema:
    """Заказы покупателя, свежие первыми. Статусы меняются через /admin/orders."""

    items, total = await orders.list_for_user(user.id, limit, offset)

    return OrderAdminListSchema(
        orders=[OrderAdminSchema.model_validate(item) for item in items],
        total=total,
    )


@router.get("/{user_id}/favorites")
async def list_user_favorites(
    limit: int = Query(10, ge=1, le=50),
    offset: int = Query(0, ge=0),
    user: User = Depends(get_user_by_id),
    favorites: FavoriteRepository = Depends(get_favorite_repository),
) -> ProductListSchema:
    """Избранное покупателя."""

    products, total = await favorites.list_products(user.id, limit, offset)

    return ProductListSchema(
        products=[ProductCardSchema.model_validate(product) for product in products],
        total=total,
    )


@router.get("/{user_id}/cart")
async def list_user_cart(
    limit: int = Query(10, ge=1, le=50),
    offset: int = Query(0, ge=0),
    user: User = Depends(get_user_by_id),
    cart: CartRepository = Depends(get_cart_repository),
) -> CartPageSchema:
    """Корзина покупателя."""

    items, total = await cart.page_items(user.id, limit, offset)

    return CartPageSchema(items=build_cart_rows(items), total=total)
