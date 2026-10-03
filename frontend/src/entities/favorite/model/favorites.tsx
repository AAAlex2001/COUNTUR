"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ProductCardData } from "@/entities/product";
import { useUser } from "@/entities/user";
import { fetchFavorites } from "../api/favorites";

type FavoritesValue = {
  products: ProductCardData[];
  ids: number[];
  loaded: boolean;
  setProducts: (products: ProductCardData[]) => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

const NO_PRODUCTS: ProductCardData[] = [];

type FavoritesProviderProps = {
  initialProducts: ProductCardData[];
  children: ReactNode;
};

/** Хранит товары избранного: с сервера приходят готовыми, после смены аккаунта перечитываются. */
export const FavoritesProvider = ({ initialProducts, children }: FavoritesProviderProps) => {
  const { user } = useUser();
  const [products, setProducts] = useState(initialProducts);
  const [loadedFor, setLoadedFor] = useState(user?.id ?? null);

  useEffect(() => {
    if (!user || user.id === loadedFor) return;

    fetchFavorites()
      .then(setProducts)
      .catch(() => undefined)
      .finally(() => setLoadedFor(user.id));
  }, [user, loadedFor]);

  const ready = user !== null && loadedFor === user.id;
  const visible = ready ? products : NO_PRODUCTS;

  const value = {
    products: visible,
    ids: visible.map((product) => product.id),
    loaded: user === null || ready,
    setProducts,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

/** Избранное из FavoritesProvider и функция его замены. */
export const useFavorites = (): FavoritesValue => {
  const value = useContext(FavoritesContext);

  if (!value) {
    throw new Error("useFavorites можно вызывать только внутри FavoritesProvider");
  }

  return value;
};
