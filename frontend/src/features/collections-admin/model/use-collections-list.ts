"use client";

import { useEffect, useReducer } from "react";
import { fetchCollections } from "../api/collections";
import { listReducer } from "./reducers";

/** Список подборок админки. */
export const useCollectionsList = () => {
  const [state, dispatch] = useReducer(listReducer, { collections: null, failed: false });

  useEffect(() => {
    fetchCollections()
      .then((collections) => dispatch({ type: "load/success", collections }))
      .catch(() => dispatch({ type: "load/error" }));
  }, []);

  return state;
};
