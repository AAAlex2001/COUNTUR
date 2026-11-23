import { cache } from "react";
import { load } from "@/shared/api/server";
import type { ContactsSettings } from "../model/types";

/** Публичные настройки страницы контактов. */
export const getContacts = cache(() => load<ContactsSettings | null>("/v1/contacts", null));
