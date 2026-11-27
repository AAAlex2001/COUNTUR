export type Shipment = {
  city: string;
  weight: number;
  length: number;
  width: number;
  height: number;
};

export type DeliveryTariff = {
  tariff_code: number;
  tariff_name: string;
  delivery_sum: number;
  period_min: number;
  period_max: number;
};
