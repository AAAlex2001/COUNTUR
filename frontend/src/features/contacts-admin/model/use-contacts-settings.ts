"use client";

import { useEffect, useState } from "react";
import type { ContactsSettings } from "@/entities/contacts";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchContactsSettings, saveContactsSettings } from "../api/contacts";

export const useContactsSettings = () => {
  const toast = useToast();
  const [settings, setSettings] = useState<ContactsSettings | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetchContactsSettings(controller.signal)
      .then(setSettings)
      .catch((failure) => {
        if (!controller.signal.aborted) {
          setLoadError(errorMessage(failure, "Не удалось загрузить контакты"));
        }
      });

    return () => controller.abort();
  }, []);

  const save = async (fields: ContactsSettings): Promise<ContactsSettings | null> => {
    if (saving) return null;
    setSaving(true);

    try {
      const saved = await saveContactsSettings(fields);
      toast("Контакты сохранены");
      return saved;
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить контакты"), "error");
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { settings, loadError, saving, save };
};
