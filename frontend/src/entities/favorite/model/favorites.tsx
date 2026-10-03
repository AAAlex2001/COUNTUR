"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useUser } from "@/entities/user";
import { fetchFavoriteIds } from "../api/favorites";

type FavoritesValue = {
  ids: number[];
  loaded: boolean;
  setIds: (ids: number[]) => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

const NO_IDS: number[] = [];

type FavoritesProviderProps = {
  initialIds: number[];
  children: ReactNode;
};

/** Хранит id товаров в избранном: с сервера приходят готовыми, после смены аккаунта перечитываются. */
export const FavoritesProvider = ({ initialIds, children }: FavoritesProviderProps) => {
  const { user } = useUser();
  const [ids, setIds] = useState(initialIds);
  const [loadedFor, setLoadedFor] = useState(user?.id ?? null);

  useEffect(() => {
    if (!user || user.id === loadedFor) return;

    fetchFavoriteIds()
      .then(setIds)
      .catch(() => undefined)
      .finally(() => setLoadedFor(user.id));
  }, [user, loadedFor]);

  const ready = user !== null && loadedFor === user.id;

  const value = {
    ids: ready ? ids : NO_IDS,
    loaded: user === null || ready,
    setIds,
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
