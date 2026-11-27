import type { DeliveryTariff } from "@/entities/delivery";
import { formatRub } from "@/shared/lib/money";

type TariffListProps = {
  tariffs: DeliveryTariff[];
};

/** Показывает стоимость и сроки каждого доступного тарифа. */
export default function TariffList({ tariffs }: TariffListProps) {
  if (!tariffs.length) return <p>Для этой посылки тарифов нет.</p>;

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
