import { API_URL, readErrorMessage } from "@/shared/api";

const SUBSCRIPTIONS_URL = `${API_URL}/v1/stock-subscriptions`;

/** Прочитать подписки покупателя. */
export async function fetchSubscriptions(signal: AbortSignal): Promise<number[]> {
  const response = await fetch(SUBSCRIPTIONS_URL, { credentials: "include", cache: "no-store", signal });

  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
}

/** Сохранить подписку на товар. */
async function updateSubscription(productId: number, method: "PUT" | "DELETE"): Promise<void> {
  const response = await fetch(`${SUBSCRIPTIONS_URL}/${productId}`, { method, credentials: "include" });

  if (!response.ok) throw new Error(await readErrorMessage(response));
}

/** Подписаться на поступление. */
export function subscribeToStock(productId: number) {
  return updateSubscription(productId, "PUT");
}

/** Отменить подписку на поступление. */
export function unsubscribeFromStock(productId: number) {
  return updateSubscription(productId, "DELETE");
}
