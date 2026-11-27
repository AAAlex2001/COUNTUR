"use client";

import { useEffect, useState } from "react";
import type { ContactsSettings } from "@/entities/contacts";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchContactsSettings, saveContactsSettings } from "../api/contacts";
import type { ChangeContact } from "./types";

/** Загружает черновик контактов и сохраняет его в админке. */
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

  /** Меняет одно текстовое поле или переключатель видимости. */
  const change: ChangeContact = (name, value) => {
    setSettings((current) => current && { ...current, [name]: value });
  };

  /** Сохраняет текущую форму и принимает проверенные сервером значения. */
  const save = async () => {
    if (!settings || saving) return;
    setSaving(true);

    try {
      const saved = await saveContactsSettings(settings);
      setSettings(saved);
      toast("Контакты сохранены");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить контакты"), "error");
    } finally {
      setSaving(false);
    }
  };

  return { settings, loadError, saving, change, save };
};
