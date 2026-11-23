"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_FEEDBACK_PATH } from "@/shared/lib/admin-paths";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { deleteFeedbackMessage } from "../api/feedback";

export const useDeleteFeedback = (messageId: number) => {
  const router = useRouter();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const askDelete = () => setConfirming(true);

  const cancelDelete = () => {
    if (!deleting) setConfirming(false);
  };

  const deleteMessage = async () => {
    if (deleting) return;
    setDeleting(true);

    try {
      await deleteFeedbackMessage(messageId);
      toast("Обращение удалено");
      router.replace(ADMIN_FEEDBACK_PATH);
    } catch (failure) {
      setDeleting(false);
      toast(errorMessage(failure, "Не удалось удалить обращение"), "error");
    }
  };

  return { confirming, deleting, askDelete, cancelDelete, deleteMessage };
};
