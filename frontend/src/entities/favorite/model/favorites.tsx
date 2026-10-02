"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchFavoriteIds } from "../api/favorites";

type FavoritesValue = {
  ids: number[];
  loaded: boolean;
  setIds: (ids: number[]) => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

type FavoritesProviderProps = {
  children: ReactNode;
};

/** Хранит id товаров в избранном: загружает их один раз и раздаёт всем компонентам. */
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [ids, setIds] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchFavoriteIds()
      .then(setIds)
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  return (
    <FavoritesContext.Provider value={{ ids, loaded, setIds }}>
      {children}
    </FavoritesContext.Provider>
  );
};

/** Избранное из FavoritesProvider и функция его замены. */
export const useFavorites = (): FavoritesValue => {
  const value = useContext(FavoritesContext);

  if (!value) {
    throw new Error("useFavorites можно вызывать только внутри FavoritesProvider");
  }

  return value;
};
