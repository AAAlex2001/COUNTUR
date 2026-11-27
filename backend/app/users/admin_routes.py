from fastapi import APIRouter, Depends, Query

from app.admin.dependencies import require_admin
from app.cart.dependencies import get_cart_repository
from app.cart.repository import CartRepository
from app.cart.schemas import CartPageSchema, build_cart_rows
from app.catalog.schemas import ProductCardSchema, ProductListSchema
from app.favorites.dependencies import get_favorite_repository
from app.favorites.repository import FavoriteRepository
from app.orders.dependencies import get_order_repository
from app.orders.repositories.orders import OrderFilter, OrderRepository
from app.orders.schemas import OrderAdminListSchema, OrderAdminSchema
from app.users.dependencies import get_user_by_id, get_user_repository
from app.users.models import User
from app.users.repository import UserRepository
from app.users.schemas import UserAdminListSchema, UserSchema

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

    search = q.strip() if q else None
    items = await users.list_users(search, limit, offset)
    total = await users.count_users(search)

    return UserAdminListSchema(
        users=[UserSchema.model_validate(item) for item in items], total=total
    )


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

    filters = OrderFilter(user_id=user.id)
    items = await orders.list_orders(filters, limit, offset)
    total = await orders.count_orders(filters)

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

    products = await favorites.list_products(user.id, limit, offset)
    total = await favorites.count_products(user.id)

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

    items = await cart.page_items(user.id, limit, offset)
    total = await cart.count_items(user.id)

    return CartPageSchema(items=build_cart_rows(items), total=total)
