import type { ContactsSettings } from "@/entities/contacts";
import { adminRequest, jsonBody } from "@/shared/api";

export const fetchContactsSettings = (signal: AbortSignal) =>
  adminRequest<ContactsSettings>("/contacts", { signal });

export const saveContactsSettings = (settings: ContactsSettings) =>
  adminRequest<ContactsSettings>("/contacts", jsonBody("PUT", settings));
