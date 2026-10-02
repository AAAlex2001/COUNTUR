import type { Metadata } from "next";
import Cart from "@/widgets/cart";

export const metadata: Metadata = {
  title: "Корзина",
};

export default function CartRoute() {
  return (
    <main>
      <Cart />
    </main>
  );
}
