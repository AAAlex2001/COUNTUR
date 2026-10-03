"use client";

import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { ADMIN_COLLECTIONS_PATH } from "@/shared/lib/admin-paths";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { deleteCollection } from "../api/collections";
import { actionsReducer } from "./reducers";
import type { AdminCollection } from "./types";

/** Удаление подборки через подтверждение. */
export const useCollectionActions = (collection: AdminCollection) => {
  const router = useRouter();
  const toast = useToast();
  const [state, dispatch] = useReducer(actionsReducer, { pending: false, confirming: false });

  const remove = async () => {
    dispatch({ type: "request/start" });

    try {
      await deleteCollection(collection.id);
      toast("Подборка удалена");
      router.replace(ADMIN_COLLECTIONS_PATH);
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось удалить подборку"), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  const askRemove = () => dispatch({ type: "remove/ask" });
  const cancelRemove = () => dispatch({ type: "remove/cancel" });

  return { state, remove, askRemove, cancelRemove };
};
