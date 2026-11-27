import type { Shipment } from "@/entities/delivery";

type ParcelField = {
  name: Exclude<keyof Shipment, "city">;
  label: string;
  max: number;
};

export const PARCEL_FIELDS: ParcelField[] = [
  { name: "weight", label: "Вес, г", max: 1_000_000 },
  { name: "length", label: "Длина, см", max: 500 },
  { name: "width", label: "Ширина, см", max: 500 },
  { name: "height", label: "Высота, см", max: 500 },
];
