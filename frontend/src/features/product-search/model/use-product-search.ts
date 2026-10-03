"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { productPath, searchProducts } from "@/entities/product";
import { MIN_QUERY_LENGTH, searchReducer } from "./reducer";

const DEBOUNCE_MS = 250;
const LIMIT = 6;

/** Поиск в шапке: подсказки по мере ввода, Enter открывает первый найденный товар. */
export const useProductSearch = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(searchReducer, {
    query: "",
    products: [],
    total: 0,
    loading: false,
    open: false,
  });
  const query = state.query.trim();
  const active = query.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!active) return;

    let current = true;
    const timer = setTimeout(() => {
      searchProducts(query, LIMIT)
        .catch(() => ({ products: [], total: 0 }))
        .then((list) => {
          if (current) dispatch({ type: "results/finish", ...list });
        });
    }, DEBOUNCE_MS);

    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [query, active]);

  const change = (value: string) => dispatch({ type: "query/change", query: value });
  const open = () => dispatch({ type: "open" });
  const close = () => dispatch({ type: "close" });

  /** Открыть страницу первого найденного товара. */
  const submit = () => {
    const [first] = state.products;

    if (!first) return;

    close();
    router.push(productPath(first.slug));
  };

  return { state, visible: state.open && active, change, open, close, submit };
};
