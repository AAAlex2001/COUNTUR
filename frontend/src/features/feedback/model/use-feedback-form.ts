"use client";

import { useReducer } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { sendFeedback } from "../api/feedback";
import { EMPTY_FIELDS, feedbackReducer } from "./reducer";
import type { FeedbackFields } from "./types";

/** Форма обратной связи: поля, согласие и отправка. */
export const useFeedbackForm = () => {
  const toast = useToast();
  const [state, dispatch] = useReducer(feedbackReducer, {
    fields: EMPTY_FIELDS,
    pending: false,
    sent: false,
  });
  const { fields } = state;

  const change = (changes: Partial<FeedbackFields>) =>
    dispatch({ type: "fields/change", changes });

  const reset = () => dispatch({ type: "reset" });

  const filled =
    fields.name.trim().length >= 2 &&
    fields.email.includes("@") &&
    fields.subject.trim().length >= 2 &&
    fields.message.trim().length >= 10 &&
    fields.consent;

  const send = async () => {
    if (!filled) {
      toast("Заполните все поля и подтвердите согласие", "error");

      return;
    }

    dispatch({ type: "send/start" });

    try {
      await sendFeedback(fields);
      dispatch({ type: "send/success" });
      toast("Сообщение отправлено");
    } catch (failure) {
      dispatch({ type: "send/error" });
      toast(errorMessage(failure, "Не удалось отправить сообщение"), "error");
    }
  };

  return { state, change, send, reset };
};
