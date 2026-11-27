"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_FEEDBACK_PATH } from "@/shared/lib/admin-paths";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { deleteFeedbackMessage } from "../api/feedback";
import type { DeleteFeedbackStatus } from "./types";

/** Управляет подтверждением удаления и возвратом к списку обращений. */
export const useDeleteFeedback = (messageId: number) => {
  const router = useRouter();
  const toast = useToast();
  const [status, setStatus] = useState<DeleteFeedbackStatus>("idle");

  /** Открывает диалог подтверждения. */
  const askDelete = () => setStatus("confirming");

  /** Закрывает диалог до начала удаления. */
  const cancelDelete = () => {
    if (status === "confirming") setStatus("idle");
  };

  /** Удаляет обращение и открывает список после успеха. */
  const deleteMessage = async () => {
    if (status !== "confirming") return;
    setStatus("deleting");

    try {
      await deleteFeedbackMessage(messageId);
      toast("Обращение удалено");
      router.replace(ADMIN_FEEDBACK_PATH);
    } catch (failure) {
      setStatus("confirming");
      toast(errorMessage(failure, "Не удалось удалить обращение"), "error");
    }
  };

  return {
    confirming: status !== "idle",
    deleting: status === "deleting",
    askDelete,
    cancelDelete,
    deleteMessage,
  };
};
