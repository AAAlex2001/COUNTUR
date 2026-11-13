"use client";

import { useEffect, useReducer } from "react";
import { errorMessage, INVALID_FORM_MESSAGE } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchMessage, replyToMessage } from "../api/feedback";
import { messageReducer } from "./reducers";

const REPLY_MIN_LENGTH = 2;

/** Карточка обращения в админке и отправка ответа на почту. */
export const useFeedbackMessage = (messageId: number) => {
  const toast = useToast();
  const [state, dispatch] = useReducer(messageReducer, {
    message: null,
    failed: false,
    reply: "",
    pending: false,
    showErrors: false,
  });
  const replyError =
    state.showErrors && state.reply.trim().length < REPLY_MIN_LENGTH ? "Напишите текст ответа" : undefined;

  useEffect(() => {
    fetchMessage(messageId)
      .then((message) => dispatch({ type: "load/success", message }))
      .catch(() => dispatch({ type: "load/error" }));
  }, [messageId]);

  const changeReply = (reply: string) => dispatch({ type: "reply/change", reply });

  /** Отправить ответ. Письмо уходит на email отправителя, обращение становится отвеченным. */
  const send = async () => {
    const text = state.reply.trim();

    if (text.length < REPLY_MIN_LENGTH) {
      dispatch({ type: "errors/show" });
      toast(INVALID_FORM_MESSAGE, "error");
      return;
    }

    dispatch({ type: "send/start" });

    try {
      dispatch({ type: "send/success", message: await replyToMessage(messageId, text) });
      toast("Ответ отправлен на почту");
    } catch (failure) {
      dispatch({ type: "send/error" });
      toast(errorMessage(failure, "Не удалось отправить ответ"), "error");
    }
  };

  return { state, replyError, changeReply, send };
};
