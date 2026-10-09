"use client";

import { useEffect, useReducer } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchMessage, replyToMessage } from "../api/feedback";
import { messageReducer } from "./reducers";

/** Карточка обращения в админке и отправка ответа на почту. */
export const useFeedbackMessage = (messageId: number) => {
  const toast = useToast();
  const [state, dispatch] = useReducer(messageReducer, {
    message: null,
    failed: false,
    reply: "",
    pending: false,
  });

  useEffect(() => {
    fetchMessage(messageId)
      .then((message) => dispatch({ type: "load/success", message }))
      .catch(() => dispatch({ type: "load/error" }));
  }, [messageId]);

  const changeReply = (reply: string) => dispatch({ type: "reply/change", reply });

  /** Отправить ответ. Письмо уходит на email отправителя, обращение становится отвеченным. */
  const send = async () => {
    const text = state.reply.trim();

    if (text.length < 2) return;

    dispatch({ type: "send/start" });

    try {
      dispatch({ type: "send/success", message: await replyToMessage(messageId, text) });
      toast("Ответ отправлен на почту");
    } catch (failure) {
      dispatch({ type: "send/error" });
      toast(errorMessage(failure, "Не удалось отправить ответ"), "error");
    }
  };

  return { state, changeReply, send };
};
