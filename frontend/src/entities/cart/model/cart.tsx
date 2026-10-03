"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useUser } from "@/entities/user";
import { fetchCart } from "../api/cart";
import type { Cart } from "./types";

type CartValue = {
  cart: Cart;
  loaded: boolean;
  setCart: (cart: Cart) => void;
};

const CartContext = createContext<CartValue | null>(null);

const EMPTY_CART: Cart = { items: [], total_quantity: 0, total: "0" };

type CartProviderProps = {
  children: ReactNode;
};

/** Хранит корзину покупателя: загружает её после входа и раздаёт всем компонентам. */
export const CartProvider = ({ children }: CartProviderProps) => {
  const { user, loaded: userLoaded } = useUser();
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [loadedFor, setLoadedFor] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    fetchCart()
      .then(setCart)
      .catch(() => undefined)
      .finally(() => setLoadedFor(user.id));
  }, [user]);

  const ready = user !== null && loadedFor === user.id;

  const value = {
    cart: ready ? cart : EMPTY_CART,
    loaded: userLoaded && (user === null || ready),
    setCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/** Корзина из CartProvider и функция её замены. */
export const useCart = (): CartValue => {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart можно вызывать только внутри CartProvider");
  }

  return value;
};
