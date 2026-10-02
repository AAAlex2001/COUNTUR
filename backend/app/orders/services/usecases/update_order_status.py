"""Сценарий изменения статусов заказа администратором."""

from app.catalog.services.repo import ProductRepository
from app.orders.models import Order, OrderStatus
from app.orders.schemas import OrderStatusUpdateSchema
from app.orders.services.repo import OrderRepository
from app.orders.services.stock import restore_stock
from app.orders.services.validators import validate_status_change


class UpdateOrderStatusUseCase:
    """Изменить статусы заказа. Отмена возвращает товары на склад и необратима."""

    def __init__(self, orders: OrderRepository, products: ProductRepository) -> None:
        self.orders = orders
        self.products = products

    async def execute(self, order: Order, payload: OrderStatusUpdateSchema) -> Order:
        """Вернуть обновлённый заказ. Бросает OrderStatusError."""

        validate_status_change(order.status, payload.status)

        canceling = payload.status == OrderStatus.CANCELED and order.status != OrderStatus.CANCELED

        if canceling:
            product_ids = [item.product_id for item in order.items if item.product_id is not None]
            products = {
                product.id: product for product in await self.products.list_by_ids(product_ids)
            }

            for item in order.items:
                product = products.get(item.product_id) if item.product_id is not None else None
                if product is not None:
                    restore_stock(product, item.quantity)

        if payload.status is not None:
            order.status = payload.status

        if payload.payment_status is not None:
            order.payment_status = payload.payment_status

        return await self.orders.save(order)
