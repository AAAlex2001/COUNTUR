import type { OrderStatus, PaymentStatus } from "../model/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Новый",
  confirmed: "Подтверждён",
  awaiting_payment: "Ждёт оплаты",
  paid: "Оплачен",
  shipped: "В пути",
  completed: "Получен",
  canceled: "Отменён",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Не оплачен",
  pending: "Ожидает оплаты",
  paid: "Оплачен",
  failed: "Ошибка оплаты",
  refunded: "Возврат",
};

/** Номер заказа вида CT-000012. */
export const orderNumber = (id: number) => `CT-${String(id).padStart(6, "0")}`;
