import { API_URL, jsonBody, readErrorMessage } from "@/shared/api";
import type { DeliveryTariff, Shipment } from "../model/types";

/** Запрашивает стоимость и сроки доставки для одного грузового места. */
export async function estimateDelivery(shipment: Shipment): Promise<DeliveryTariff[]> {
  const response = await fetch(`${API_URL}/v1/delivery/estimate`, jsonBody("POST", shipment));

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response.json();
}
