import type { ContactFields } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_MIN_DIGITS = 10;
const PHONE_MAX_DIGITS = 15;

/** Текст первой ошибки в контактных данных или null, если всё заполнено верно. */
export const validateContacts = (contacts: ContactFields, consent: boolean): string | null => {
  const phoneDigits = contacts.phone.replace(/\D/g, "").length;

  if (contacts.firstName.trim().length < 2) return "Укажите имя";
  if (contacts.lastName.trim().length < 2) return "Укажите фамилию";

  if (phoneDigits < PHONE_MIN_DIGITS || phoneDigits > PHONE_MAX_DIGITS) {
    return "Укажите телефон в формате +7 999 000-00-00";
  }

  if (!EMAIL_PATTERN.test(contacts.email.trim())) return "Укажите корректный email";
  if (!contacts.city.trim()) return "Укажите город";
  if (!consent) return "Нужно согласие на обработку персональных данных";

  return null;
};
