export type FeedbackStatus = "new" | "answered";

export type FeedbackMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: FeedbackStatus;
  reply: string | null;
  answered_at: string | null;
  created_at: string;
};

export type FeedbackList = {
  messages: FeedbackMessage[];
  total: number;
};

export type StatusFilter = FeedbackStatus | "all";

export type ListState = {
  filter: StatusFilter;
  page: number;
  list: FeedbackList | null;
  loading: boolean;
  failed: boolean;
};

export type ListAction =
  | { type: "load/start"; filter: StatusFilter; page: number }
  | { type: "load/success"; list: FeedbackList }
  | { type: "load/error" };

export type MessageState = {
  message: FeedbackMessage | null;
  failed: boolean;
  reply: string;
  pending: boolean;
};

export type MessageAction =
  | { type: "load/success"; message: FeedbackMessage }
  | { type: "load/error" }
  | { type: "reply/change"; reply: string }
  | { type: "send/start" }
  | { type: "send/success"; message: FeedbackMessage }
  | { type: "send/error" };
