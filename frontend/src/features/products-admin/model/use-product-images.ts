"use client";

import { useReducer } from "react";
import { swap } from "@/shared/lib/array";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { deleteProductImage, reorderProductImages, uploadProductImage } from "../api/products";
import { imagesReducer } from "./reducers";
import type { AdminProduct } from "./types";

/** Фото существующего товара: загрузка, порядок и удаление. */
export const useProductImages = (
  product: AdminProduct,
  onChange: (product: AdminProduct) => void,
) => {
  const toast = useToast();
  const [state, dispatch] = useReducer(imagesReducer, { pending: false });

  /** Выполнить запрос, который возвращает обновлённый товар, и показать уведомление. */
  const send = async (request: () => Promise<AdminProduct>, success: string) => {
    dispatch({ type: "request/start" });

    try {
      onChange(await request());
      toast(success);
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось изменить фото"), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  const upload = async (files: File[]) => {
    for (const file of files) {
      await send(() => uploadProductImage(product.id, file), "Фото загружено");
    }
  };

  const move = (index: number, shift: number) => {
    const ids = product.images.map((image) => image.id);

    return send(() => reorderProductImages(product.id, swap(ids, index, shift)), "Порядок изменён");
  };

  const remove = (index: number) =>
    send(() => deleteProductImage(product.id, product.images[index].id), "Фото удалено");

  return { state, upload, move, remove };
};
