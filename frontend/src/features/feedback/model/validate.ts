import type { FeedbackFields } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN_LENGTH = 10;

/** Текст первой ошибки в форме обращения или null, если всё заполнено верно. */
export const validateFeedback = (fields: FeedbackFields): string | null => {
  if (fields.name.trim().length < 2) return "Укажите имя";
  if (!EMAIL_PATTERN.test(fields.email.trim())) return "Укажите корректный email";
  if (fields.subject.trim().length < 2) return "Укажите тему обращения";

  if (fields.message.trim().length < MESSAGE_MIN_LENGTH) {
    return `Сообщение должно быть не короче ${MESSAGE_MIN_LENGTH} символов`;
  }

  if (!fields.consent) return "Нужно согласие на обработку персональных данных";

  return null;
};
