import type { FeedbackStatus, StatusFilter } from "../model/types";

export const FEEDBACK_STATUS_LABELS: Record<FeedbackStatus, string> = {
  new: "Ждёт ответа",
  answered: "Отвечено",
};

export const FEEDBACK_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "new", label: "Ждут ответа" },
  { value: "answered", label: "Отвеченные" },
  { value: "all", label: "Все" },
];
