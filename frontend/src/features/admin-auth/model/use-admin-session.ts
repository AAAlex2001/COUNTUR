"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { ADMIN_LOGIN_PATH } from "@/shared/lib/admin-paths";
import { fetchMe, logout } from "../api/auth";
import { sessionReducer } from "./reducers";

/** Проверка входа в админку. Без входа уводит на страницу входа. */
export const useAdminSession = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(sessionReducer, { ready: false });

  useEffect(() => {
    fetchMe()
      .then(() => dispatch({ type: "session/confirmed" }))
      .catch(() => router.replace(ADMIN_LOGIN_PATH));
  }, [router]);

  const exit = async () => {
    await logout().catch(() => undefined);
    router.replace(ADMIN_LOGIN_PATH);
  };

  return { state, exit };
};
