"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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

/** Хранит корзину посетителя: загружает её один раз и раздаёт всем компонентам. */
export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchCart()
      .then(setCart)
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  return (
    <CartContext.Provider value={{ cart, loaded, setCart }}>{children}</CartContext.Provider>
  );
};

/** Корзина из CartProvider и функция её замены. */
export const useCart = (): CartValue => {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart можно вызывать только внутри CartProvider");
  }

  return value;
};
