"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useUser } from "@/entities/user";
import { fetchCart } from "../api/cart";
import { EMPTY_CART, type Cart } from "./types";

type CartValue = {
  cart: Cart;
  loaded: boolean;
  setCart: (cart: Cart) => void;
};

const CartContext = createContext<CartValue | null>(null);

type CartProviderProps = {
  initialCart: Cart;
  children: ReactNode;
};

/** Хранит корзину покупателя: с сервера приходит готовой, после смены аккаунта перечитывается. */
export const CartProvider = ({ initialCart, children }: CartProviderProps) => {
  const { user } = useUser();
  const [cart, setCart] = useState(initialCart);
  const [loadedFor, setLoadedFor] = useState(user?.id ?? null);

  useEffect(() => {
    if (!user || user.id === loadedFor) return;

    fetchCart()
      .then(setCart)
      .catch(() => undefined)
      .finally(() => setLoadedFor(user.id));
  }, [user, loadedFor]);

  const ready = user !== null && loadedFor === user.id;

  const value = {
    cart: ready ? cart : EMPTY_CART,
    loaded: user === null || ready,
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
