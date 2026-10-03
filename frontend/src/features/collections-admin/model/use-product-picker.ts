"use client";

import { useEffect, useReducer } from "react";
import type { ProductCardData } from "@/entities/product";
import { searchAdminProducts } from "../api/collections";
import { pickerReducer } from "./reducers";

const DEBOUNCE_MS = 250;

/** Поиск товаров для состава подборки: подсказки по мере ввода. */
export const useProductPicker = (onPick: (product: ProductCardData) => void) => {
  const [state, dispatch] = useReducer(pickerReducer, { query: "", results: [], loading: false });
  const query = state.query.trim();

  useEffect(() => {
    if (!query) return;

    let active = true;
    const timer = setTimeout(() => {
      searchAdminProducts(query)
        .catch(() => [])
        .then((results) => {
          if (active) dispatch({ type: "results/finish", results });
        });
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const change = (value: string) => dispatch({ type: "query/change", query: value });

  /** Добавить товар в состав и очистить поиск. */
  const pick = (product: ProductCardData) => {
    onPick(product);
    dispatch({ type: "clear" });
  };

  return { state, visible: query.length > 0, change, pick };
};
