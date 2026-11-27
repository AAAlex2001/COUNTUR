"use client";

import { useEffect, useReducer } from "react";
import { pagedReducer } from "./reducers";
import type { PageLoader } from "./types";

export const PAGE_SIZE = 10;

/** Постраничный список покупателя. `load` — функция API, одна и та же между рендерами. */
export const usePagedList = <T>(load: PageLoader<T>, userId: number) => {
  const [state, dispatch] = useReducer(pagedReducer<T>, {
    items: [],
    total: 0,
    page: 1,
    loading: true,
    failed: false,
  });
  const { page } = state;

  useEffect(() => {
    let active = true;

    load(userId, PAGE_SIZE, (page - 1) * PAGE_SIZE)
      .then((result) => {
        if (active) dispatch({ type: "load/success", page: result });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [load, userId, page]);

  const openPage = (nextPage: number) => dispatch({ type: "load/start", page: nextPage });
  const updateItems = (update: (items: T[]) => T[]) => dispatch({ type: "items/update", update });

  const pages = Math.ceil(state.total / PAGE_SIZE);

  return { state, pages, openPage, updateItems };
};
