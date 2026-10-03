import type { OrderStatus } from "../model/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Новый",
  confirmed: "Подтверждён",
  awaiting_payment: "Ждёт оплаты",
  paid: "Оплачен",
  shipped: "В пути",
  completed: "Получен",
  canceled: "Отменён",
};

export const ORDER_STATUS_TONES: Record<OrderStatus, "progress" | "done" | "muted"> = {
  new: "progress",
  confirmed: "progress",
  awaiting_payment: "progress",
  paid: "progress",
  shipped: "progress",
  completed: "done",
  canceled: "muted",
};

/** Номер заказа вида CT-000012. */
export const orderNumber = (id: number) => `CT-${String(id).padStart(6, "0")}`;
