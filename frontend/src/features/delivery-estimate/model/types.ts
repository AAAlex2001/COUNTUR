import type { DeliveryTariff, Shipment } from "@/entities/delivery";

export type ParcelField = {
  name: Exclude<keyof Shipment, "city">;
  label: string;
  max: number;
};

export type EstimateState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; tariffs: DeliveryTariff[] }
  | { status: "error"; message: string };
