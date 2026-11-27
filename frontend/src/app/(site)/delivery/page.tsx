import type { Metadata } from "next";
import { isDeliveryAvailable } from "@/entities/delivery/server";
import { DELIVERY_PATH } from "@/shared/config/site";
import Delivery from "@/widgets/delivery";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  alternates: { canonical: DELIVERY_PATH },
};

/** Открывает страницу доставки с учётом настроек перевозчика. */
export default async function DeliveryRoute() {
  const calculatorAvailable = await isDeliveryAvailable();

  return (
    <main>
      <Delivery calculatorAvailable={calculatorAvailable} />
    </main>
  );
}
