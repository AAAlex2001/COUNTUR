from app.catalog.repositories.products import ProductRepository
from app.orders.exceptions import OrderNotFoundError
from app.orders.models import DeliveryMethod, Order, OrderMailKind, OrderStatus
from app.orders.repositories.mail_queue import OrderMailQueue
from app.orders.repositories.orders import OrderRepository
from app.orders.schemas import OrderStatusUpdateSchema
from app.orders.stock import restore_stock
from app.orders.validators import validate_status_change


class UpdateOrderStatusUseCase:
    """Изменение статуса заказа."""

    def __init__(
        self, orders: OrderRepository, products: ProductRepository, mail: OrderMailQueue
    ) -> None:
        """Подключить заказы и остатки."""

        self.orders = orders
        self.products = products
        self.mail = mail

    async def execute(self, order_id: int, payload: OrderStatusUpdateSchema) -> Order:
        """Обновить состояние заказа."""

        order = await self.orders.lock_by_id(order_id)
        if order is None:
            raise OrderNotFoundError(order_id)

        validate_status_change(order.status, payload.status)

        if payload.status == OrderStatus.CANCELED and order.status != OrderStatus.CANCELED:
            await self.return_items(order)

        if payload.status is not None:
            order.status = payload.status
        if payload.payment_status is not None:
            order.payment_status = payload.payment_status
        if payload.tracking_number is not None:
            order.tracking_number = payload.tracking_number

        await self.queue_shipment_notice(order)
        return await self.orders.save(order)

    async def queue_shipment_notice(self, order: Order) -> None:
        """Запланировать письмо с трек-номером."""

        if not order.buyer.notify_orders or order.delivery_method == DeliveryMethod.PICKUP:
            return

        if order.status == OrderStatus.SHIPPED and order.tracking_number:
            await self.mail.enqueue(
                order, kind=OrderMailKind.SHIPMENT, reference=order.tracking_number
            )

    async def return_items(self, order: Order) -> None:
        """Вернуть товары на склад."""

        product_ids = [item.product_id for item in order.items if item.product_id is not None]
        locked = await self.products.list_by_ids(product_ids, lock=True)
        products = {product.id: product for product in locked}

        for item in order.items:
            if item.product_id in products:
                restore_stock(products[item.product_id], item.quantity)
