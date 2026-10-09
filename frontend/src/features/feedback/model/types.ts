export type FeedbackFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
};

export type FeedbackState = {
  fields: FeedbackFields;
  pending: boolean;
  sent: boolean;
};

export type FeedbackAction =
  | { type: "fields/change"; changes: Partial<FeedbackFields> }
  | { type: "send/start" }
  | { type: "send/success" }
  | { type: "send/error" }
  | { type: "reset" };
