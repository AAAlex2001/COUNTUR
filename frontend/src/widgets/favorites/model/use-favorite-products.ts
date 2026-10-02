"use client";

import { useEffect, useState } from "react";
import { fetchFavoriteProducts, type ProductCardData } from "@/entities/product";

/** Карточки товаров из избранного: загружаются один раз при открытии страницы. */
export const useFavoriteProducts = () => {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchFavoriteProducts()
      .then(setProducts)
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  return { products, loaded };
};
