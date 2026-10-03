"use client";

import { useEffect, useReducer } from "react";
import { fetchCollection } from "../api/collections";
import { editorReducer } from "./reducers";
import type { AdminCollection } from "./types";

/** Страница подборки в админке. Без collectionId — новая подборка. */
export const useCollectionEditor = (collectionId?: number) => {
  const [state, dispatch] = useReducer(editorReducer, {
    status: collectionId ? "loading" : "ready",
    collection: null,
  });

  useEffect(() => {
    if (!collectionId) return;

    let active = true;

    fetchCollection(collectionId)
      .then((collection) => {
        if (active) dispatch({ type: "load/success", collection });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [collectionId]);

  const changeCollection = (collection: AdminCollection) =>
    dispatch({ type: "collection/change", collection });

  return { state, changeCollection };
};
