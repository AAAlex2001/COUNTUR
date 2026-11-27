import type { ContactsSettings } from "@/entities/contacts";
import { adminRequest, jsonBody } from "@/shared/api";

/** Загружает все настройки контактов, включая скрытые разделы. */
export const fetchContactsSettings = (signal: AbortSignal) =>
  adminRequest<ContactsSettings>("/contacts", { signal });

/** Сохраняет контакты и возвращает проверенные сервером значения. */
export const saveContactsSettings = (settings: ContactsSettings) =>
  adminRequest<ContactsSettings>("/contacts", jsonBody("PUT", settings));
