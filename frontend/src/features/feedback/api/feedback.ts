import { API_URL, readErrorMessage } from "@/shared/api";
import type { FeedbackFields } from "../model/types";

/** Отправить обращение со страницы контактов. */
export const sendFeedback = async (fields: FeedbackFields): Promise<void> => {
  const response = await fetch(`${API_URL}/v1/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });

  if (!response.ok) throw new Error(await readErrorMessage(response));
};
