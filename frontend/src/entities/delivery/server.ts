import { load } from "@/shared/api/server";

/** Проверяет, настроен ли расчёт тарифов на сервере. */
export async function isDeliveryAvailable(): Promise<boolean> {
  const settings = await load("/v1/delivery/availability", { available: false });
  return settings.available;
}
