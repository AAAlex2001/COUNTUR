"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useUser } from "@/entities/user";
import { fetchCart } from "../api/cart";
import { EMPTY_CART, type Cart } from "./types";

type CartValue = {
  cart: Cart;
  loaded: boolean;
  error: boolean;
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
  const [errorFor, setErrorFor] = useState<number | null>(null);

  useEffect(() => {
    if (!user || user.id === loadedFor) return;

    const userId = user.id;
    let isActive = true;

    fetchCart()
      .then((nextCart) => {
        if (!isActive) return;

        setCart(nextCart);
        setLoadedFor(userId);
      })
      .catch(() => {
        if (!isActive) return;

        setCart(EMPTY_CART);
        setErrorFor(userId);
        setLoadedFor(userId);
      });

    return () => {
      isActive = false;
    };
  }, [user, loadedFor]);

  const ready = user !== null && loadedFor === user.id;
  const error = user !== null && errorFor === user.id;

  const value = {
    cart: ready ? cart : EMPTY_CART,
    loaded: user === null || ready,
    error,
    setCart: (nextCart: Cart) => {
      setCart(nextCart);
      setErrorFor(null);
    },
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
