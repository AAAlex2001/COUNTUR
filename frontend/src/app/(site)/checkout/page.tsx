import type { Metadata } from "next";
import Checkout from "@/widgets/checkout";

export const metadata: Metadata = {
  title: "Оформление заказа",
  robots: { index: false, follow: false },
};

export default function CheckoutRoute() {
  return (
    <main>
      <Checkout />
    </main>
  );
}
