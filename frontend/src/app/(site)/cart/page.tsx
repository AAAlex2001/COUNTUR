import type { Metadata } from "next";
import Cart from "@/widgets/cart";

export const metadata: Metadata = {
  title: "Корзина",
  robots: { index: false, follow: false },
};

export default function CartRoute() {
  return (
    <main>
      <Cart />
    </main>
  );
}
