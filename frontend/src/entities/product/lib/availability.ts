import type { Availability } from "../model/types";

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  in_stock: "В наличии",
  out_of_stock: "Нет в наличии",
  expected: "Ожидается",
};
