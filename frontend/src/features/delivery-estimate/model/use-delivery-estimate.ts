import { useState } from "react";
import { estimateDelivery, type DeliveryTariff, type Shipment } from "@/entities/delivery";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";

/** Рассчитать тарифы доставки. */
export function useDeliveryEstimate() {
  const [pending, setPending] = useState(false);
  const [tariffs, setTariffs] = useState<DeliveryTariff[]>([]);
  const toast = useToast();

  /** Запросить тарифы СДЭК. */
  async function calculate(shipment: Shipment) {
    if (pending) return;

    setPending(true);
    setTariffs([]);
    try {
      const offers = await estimateDelivery(shipment);
      setTariffs(offers);
      if (offers.length === 0) {
        toast("Для этой посылки тарифов нет", "error");
        return;
      }
      toast("Стоимость и сроки доставки рассчитаны");
    } catch (error) {
      toast(errorMessage(error, "Ошибка расчёта доставки"), "error");
    } finally {
      setPending(false);
    }
  }

  /** Сбросить предыдущий расчёт. */
  function clearTariffs() {
    if (tariffs.length > 0) setTariffs([]);
  }

  return { pending, tariffs, calculate, clearTariffs };
}
