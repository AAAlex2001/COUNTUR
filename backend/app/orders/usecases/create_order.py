from decimal import Decimal

from app.cart.exceptions import ProductUnavailableError
from app.cart.models import CartItem
from app.cart.repository import CartRepository
from app.cart.validators import validate_purchase
from app.catalog.models import Product
from app.catalog.repositories.products import ProductRepository
from app.orders.exceptions import EmptyCartError
from app.orders.models import Order, OrderItem, OrderMailKind, OrderStatus, PaymentStatus
from app.orders.repositories.mail_queue import OrderMailQueue
from app.orders.repositories.orders import OrderRepository
from app.orders.schemas import OrderCreateSchema
from app.orders.stock import write_off_stock
from app.orders.validators import normalize_phone


def prepare_order_item(item: CartItem, product: Product | None) -> OrderItem:
    """Зафиксировать состав и цену."""

    if product is None:
        raise ProductUnavailableError("Один из товаров корзины больше не продаётся")

    validate_purchase(product, item.quantity)
    return OrderItem(
        product_id=product.id,
        product_name=product.name,
        product_sku=product.sku,
        price=product.price,
        quantity=item.quantity,
    )


class CreateOrderUseCase:
    """Оформление заказа."""

    def __init__(
        self,
        orders: OrderRepository,
        cart: CartRepository,
        products: ProductRepository,
        mail: OrderMailQueue,
    ) -> None:
        """Подключить данные заказа."""

        self.orders = orders
        self.cart = cart
        self.products = products
        self.mail = mail

    async def execute(self, user_id: int, payload: OrderCreateSchema) -> Order:
        """Оформить заказ покупателя."""

        phone = normalize_phone(payload.customer_phone)
        buyer = await self.cart.lock_owner(user_id)
        items = await self.reserve_cart(user_id)
        order = Order(
            buyer=buyer,
            customer_name=payload.customer_name,
            customer_phone=phone,
            customer_email=payload.customer_email,
            delivery_method=payload.delivery_method,
            payment_method=payload.payment_method,
            delivery_address=payload.delivery_address,
            comment=payload.comment,
            status=OrderStatus.NEW,
            payment_status=PaymentStatus.UNPAID,
            total=sum((item.subtotal for item in items), Decimal(0)),
            items=items,
        )

        await self.orders.add(order)
        if buyer.notify_orders:
            await self.mail.enqueue(order, kind=OrderMailKind.CONFIRMATION)
        await self.cart.remove_items(user_id)
        return await self.orders.save(order)

    async def reserve_cart(self, user_id: int) -> list[OrderItem]:
        """Зарезервировать товары корзины."""

        cart_items = await self.cart.list_items(user_id)
        if not cart_items:
            raise EmptyCartError("Корзина пуста")

        product_ids = [item.product_id for item in cart_items]
        locked = await self.products.lock_published(product_ids)
        products = {product.id: product for product in locked}
        items = [prepare_order_item(item, products.get(item.product_id)) for item in cart_items]

        for item in cart_items:
            write_off_stock(products[item.product_id], item.quantity)

        return items
