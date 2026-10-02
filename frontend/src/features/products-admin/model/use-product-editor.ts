"use client";

import { useEffect, useReducer } from "react";
import { fetchAdminBrands, fetchAdminCategories, fetchAdminProduct } from "../api/products";
import { editorReducer } from "./reducers";
import type { AdminProduct } from "./types";

/** Данные страницы товара: категории, бренды и сам товар. Без productId — новый товар. */
export const useProductEditor = (productId?: number) => {
  const [state, dispatch] = useReducer(editorReducer, {
    status: "loading",
    categories: [],
    brands: [],
    product: null,
  });

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchAdminCategories(),
      fetchAdminBrands(),
      productId ? fetchAdminProduct(productId) : null,
    ])
      .then(([categories, brands, product]) => {
        if (active) dispatch({ type: "load/success", categories, brands, product });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [productId]);

  const changeProduct = (product: AdminProduct) => dispatch({ type: "product/change", product });

  return { state, changeProduct };
};
