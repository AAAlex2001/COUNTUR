"use client";

import { useEffect, useReducer } from "react";
import { fetchDocuments } from "../api/documents";
import { listReducer } from "./reducers";

/** Список документов магазина в админке. */
export const useDocumentsList = () => {
  const [state, dispatch] = useReducer(listReducer, { documents: null, failed: false });

  useEffect(() => {
    fetchDocuments()
      .then((documents) => dispatch({ type: "load/success", documents }))
      .catch(() => dispatch({ type: "load/error" }));
  }, []);

  return state;
};
