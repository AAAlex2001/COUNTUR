"use client";

import { useEffect, useReducer } from "react";
import { fetchAdminUsers } from "../api/users";
import { usersListReducer } from "./reducers";

const PAGE_SIZE = 50;

/** Список покупателей админки: поиск и листание страниц. */
export const useUsersList = () => {
  const [state, dispatch] = useReducer(usersListReducer, {
    search: "",
    query: "",
    page: 1,
    list: null,
    loading: true,
    failed: false,
  });
  const { query, page } = state;

  useEffect(() => {
    let active = true;

    fetchAdminUsers(query, PAGE_SIZE, (page - 1) * PAGE_SIZE)
      .then((list) => {
        if (active) dispatch({ type: "load/success", list });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [query, page]);

  const changeSearch = (value: string) => dispatch({ type: "search/change", value });

  /** Загрузить страницу списка с поисковым запросом. */
  const open = (nextQuery: string, nextPage: number) => {
    if (nextQuery === query && nextPage === page) return;

    dispatch({ type: "load/start", query: nextQuery, page: nextPage });
  };

  const submitSearch = () => open(state.search.trim(), 1);
  const openPage = (nextPage: number) => open(query, nextPage);

  const pages = Math.ceil((state.list?.total ?? 0) / PAGE_SIZE);

  return { state, pages, changeSearch, submitSearch, openPage };
};
