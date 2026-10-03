"""Сценарий оформления заказа из корзины."""

from decimal import Decimal

from app.cart.services.exceptions import ProductUnavailableError
from app.cart.services.repo import CartRepository
from app.cart.services.validators import validate_purchase
from app.catalog.services.repo import ProductRepository
from app.orders.models import Order, OrderItem, OrderStatus, PaymentStatus
from app.orders.schemas import OrderCreateSchema
from app.orders.services.exceptions import EmptyCartError
from app.orders.services.repo import OrderRepository
from app.orders.services.stock import write_off_stock
from app.orders.services.validators import normalize_phone


class CreateOrderUseCase:
    """Превратить корзину в заказ: проверить товары, списать остатки, очистить корзину."""

    def __init__(
        self,
        orders: OrderRepository,
        cart: CartRepository,
        products: ProductRepository,
    ) -> None:
        self.orders = orders
        self.cart = cart
        self.products = products

    async def execute(self, user_id: int, payload: OrderCreateSchema) -> Order:
        """Вернуть оформленный заказ. Бросает ошибки телефона, пустой корзины и наличия."""

        phone = normalize_phone(payload.customer_phone)

        cart_items = await self.cart.list_items(user_id)
        if not cart_items:
            raise EmptyCartError("Корзина пуста")

        product_ids = [item.product_id for item in cart_items]
        locked = await self.products.lock_published(product_ids)
        products = {product.id: product for product in locked}

        order_items: list[OrderItem] = []
        total = Decimal("0")

        for item in cart_items:
            product = products.get(item.product_id)
            if product is None:
                raise ProductUnavailableError("Один из товаров корзины больше не продаётся")

            validate_purchase(product, item.quantity)

            order_items.append(
                OrderItem(
                    product_id=product.id,
                    product_name=product.name,
                    product_sku=product.sku,
                    price=product.price,
                    quantity=item.quantity,
                )
            )
            total += product.price * item.quantity

        for item in cart_items:
            write_off_stock(products[item.product_id], item.quantity)

        order = Order(
            user_id=user_id,
            customer_name=payload.customer_name.strip(),
            customer_phone=phone,
            customer_email=payload.customer_email,
            delivery_method=payload.delivery_method,
            delivery_address=payload.delivery_address,
            comment=payload.comment,
            status=OrderStatus.NEW,
            payment_status=PaymentStatus.UNPAID,
            total=total,
            items=order_items,
        )

        return await self.orders.create(order, user_id)
