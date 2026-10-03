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
  children: ReactNode;
};

/** Хранит id товаров в избранном: загружает их после входа и раздаёт всем компонентам. */
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const { user, loaded: userLoaded } = useUser();
  const [ids, setIds] = useState<number[]>(NO_IDS);
  const [loadedFor, setLoadedFor] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    fetchFavoriteIds()
      .then(setIds)
      .catch(() => undefined)
      .finally(() => setLoadedFor(user.id));
  }, [user]);

  const ready = user !== null && loadedFor === user.id;

  const value = {
    ids: ready ? ids : NO_IDS,
    loaded: userLoaded && (user === null || ready),
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
