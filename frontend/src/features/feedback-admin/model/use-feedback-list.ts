"use client";

import { useEffect, useReducer } from "react";
import { fetchFeedback } from "../api/feedback";
import { listReducer } from "./reducers";
import type { StatusFilter } from "./types";

const PAGE_SIZE = 20;

/** Список обращений админки: фильтр по статусу и листание страниц. */
export const useFeedbackList = () => {
  const [state, dispatch] = useReducer(listReducer, {
    filter: "new",
    page: 1,
    list: null,
    loading: true,
    failed: false,
  });
  const { filter, page } = state;

  useEffect(() => {
    let active = true;

    fetchFeedback(filter, PAGE_SIZE, (page - 1) * PAGE_SIZE)
      .then((list) => {
        if (active) dispatch({ type: "load/success", list });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [filter, page]);

  const changeFilter = (next: StatusFilter) => dispatch({ type: "load/start", filter: next, page: 1 });
  const openPage = (next: number) => dispatch({ type: "load/start", filter, page: next });

  const pages = Math.ceil((state.list?.total ?? 0) / PAGE_SIZE);

  return { state, pages, changeFilter, openPage };
};
