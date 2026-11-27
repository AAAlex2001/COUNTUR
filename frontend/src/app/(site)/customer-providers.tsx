"use client";

import type { ReactNode } from "react";
import { CartProvider, type Cart } from "@/entities/cart";
import { FavoritesProvider } from "@/entities/favorite";
import type { ProductCardData } from "@/entities/product";
import { StockSubscriptionsProvider } from "@/entities/stock-subscription";
import { useUser } from "@/entities/user";

type CustomerProvidersProps = {
  cart: Cart;
  favorites: ProductCardData[];
  children: ReactNode;
};

/** Подключить данные покупателя. */
export function CustomerProviders({ cart, favorites, children }: CustomerProvidersProps) {
  const { user } = useUser();

  return (
    <CartProvider initialCart={cart}>
      <FavoritesProvider initialProducts={favorites}>
        <StockSubscriptionsProvider userId={user?.id}>{children}</StockSubscriptionsProvider>
      </FavoritesProvider>
    </CartProvider>
  );
}
