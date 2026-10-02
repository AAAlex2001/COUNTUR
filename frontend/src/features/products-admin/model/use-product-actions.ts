"use client";

import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { ADMIN_PRODUCTS_PATH } from "@/shared/lib/admin-paths";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { deleteProduct, setProductStatus } from "../api/products";
import { actionsReducer } from "./reducers";
import type { AdminProduct } from "./types";

/** Публикация товара и его удаление через подтверждение. */
export const useProductActions = (
  product: AdminProduct,
  onChange: (product: AdminProduct) => void,
) => {
  const router = useRouter();
  const toast = useToast();
  const [state, dispatch] = useReducer(actionsReducer, { pending: false, confirming: false });
  const published = product.status === "published";

  const togglePublication = async () => {
    dispatch({ type: "request/start" });

    try {
      onChange(await setProductStatus(product.id, published ? "unpublished" : "published"));
      toast(published ? "Товар снят с публикации" : "Товар опубликован");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось изменить публикацию"), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  const remove = async () => {
    dispatch({ type: "request/start" });

    try {
      await deleteProduct(product.id);
      toast("Товар удалён");
      router.replace(ADMIN_PRODUCTS_PATH);
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось удалить товар"), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  const askRemove = () => dispatch({ type: "remove/ask" });
  const cancelRemove = () => dispatch({ type: "remove/cancel" });

  return { state, published, togglePublication, remove, askRemove, cancelRemove };
};
