import type { DeliveryTariff } from "@/entities/delivery";
import { formatRub } from "@/shared/lib/money";

type TariffListProps = {
  tariffs: DeliveryTariff[];
};

/** Показать тарифы доставки. */
export default function TariffList({ tariffs }: TariffListProps) {
  return (
    <ul>
      {tariffs.map((tariff) => (
        <li key={tariff.tariff_code}>
          {tariff.tariff_name} — {formatRub(tariff.delivery_sum)}, {tariff.period_min}–{tariff.period_max} дн.
        </li>
      ))}
    </ul>
  );
}
