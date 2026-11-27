import { useState, type FormEvent } from "react";
import { estimateDelivery, type Shipment } from "@/entities/delivery";
import { errorMessage } from "@/shared/lib/errors";
import type { EstimateState } from "./types";

/** Читает город и размеры из проверенной браузером формы. */
function readShipment(form: HTMLFormElement): Shipment {
  const fields = new FormData(form);

  return {
    city: String(fields.get("city") ?? "").trim(),
    weight: Number(fields.get("weight")),
    length: Number(fields.get("length")),
    width: Number(fields.get("width")),
    height: Number(fields.get("height")),
  };
}

/** Хранит результат последнего расчёта и состояние запроса. */
export function useDeliveryEstimate() {
  const [state, setState] = useState<EstimateState>({ status: "idle" });

  /** Рассчитывает тарифы для указанной посылки. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "pending") return;

    const shipment = readShipment(event.currentTarget);
    setState({ status: "pending" });

    try {
      const tariffs = await estimateDelivery(shipment);
      setState({ status: "success", tariffs });
    } catch (error) {
      setState({ status: "error", message: errorMessage(error, "Ошибка расчёта доставки") });
    }
  }

  return { state, submit };
}
