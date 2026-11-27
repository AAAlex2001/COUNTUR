"use client";

import { useState } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useAdminDraft } from "@/shared/lib/use-admin-draft";
import { useToast } from "@/shared/ui/toaster";
import { fetchContactsSettings, saveContactsSettings } from "../api/contacts";
import type { ChangeContact } from "./types";

/** Редактировать контакты магазина. */
export function useContactsSettings() {
  const { draft, setDraft, change, failed, retry } = useAdminDraft(
    fetchContactsSettings,
    "Не удалось загрузить контакты",
  );
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  /** Изменить контактное поле. */
  const changeField: ChangeContact = (name, value) => change({ [name]: value });

  /** Сохранить контакты. */
  async function save() {
    if (!draft || saving) return;
    setSaving(true);

    try {
      setDraft(await saveContactsSettings(draft));
      toast("Контакты сохранены");
    } catch (error) {
      toast(errorMessage(error, "Не удалось сохранить контакты"), "error");
    } finally {
      setSaving(false);
    }
  }

  return { settings: draft, failed, retry, saving, change: changeField, save };
}
