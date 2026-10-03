"use client";

import { useEffect, useState } from "react";
import { fetchFavoriteProducts, type ProductCardData } from "@/entities/product";
import { useUser } from "@/entities/user";

/** Карточки товаров из избранного: загружаются после входа, при смене аккаунта — заново. */
export const useFavoriteProducts = () => {
  const { user } = useUser();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loadedFor, setLoadedFor] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    fetchFavoriteProducts()
      .then(setProducts)
      .catch(() => undefined)
      .finally(() => setLoadedFor(user.id));
  }, [user]);

  return { products, loaded: user === null || loadedFor === user.id };
};
