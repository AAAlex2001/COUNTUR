import type { AuthFields, AuthTab } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

/** Текст первой ошибки в полях входа или регистрации, либо null, если всё заполнено верно. */
export const validateAuth = (tab: AuthTab, fields: AuthFields): string | null => {
  if (tab === "register" && !fields.name.trim()) return "Укажите имя";
  if (!EMAIL_PATTERN.test(fields.email.trim())) return "Укажите корректный email";
  if (!fields.password) return "Укажите пароль";

  if (tab === "login") return null;

  if (fields.password.length < PASSWORD_MIN_LENGTH) return "Пароль короче 8 символов";
  if (!/[a-zа-яё]/i.test(fields.password) || !/\d/.test(fields.password)) {
    return "В пароле должны быть и буквы, и цифры";
  }
  if (fields.password !== fields.confirm) return "Пароли не совпадают";
  if (!fields.agree) return "Нужно согласие с условиями";

  return null;
};
