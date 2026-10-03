"use client";

import { useEffect, useReducer } from "react";
import { fetchAdminUser } from "../api/users";
import { userReducer } from "./reducers";

/** Карточка покупателя в админке. */
export const useAdminUser = (userId: number) => {
  const [state, dispatch] = useReducer(userReducer, { user: null, failed: false });

  useEffect(() => {
    fetchAdminUser(userId)
      .then((user) => dispatch({ type: "load/success", user }))
      .catch(() => dispatch({ type: "load/error" }));
  }, [userId]);

  return state;
};
