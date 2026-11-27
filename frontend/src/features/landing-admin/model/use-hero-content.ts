"use client";

import { useState } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useAdminDraft } from "@/shared/lib/use-admin-draft";
import { useToast } from "@/shared/ui/toaster";
import { fetchHeroContent, saveHeroContent } from "../api/hero-content";

/** Редактировать тексты первого экрана. */
export function useHeroContent() {
  const { draft, setDraft, change, failed, retry } = useAdminDraft(
    fetchHeroContent,
    "Не удалось загрузить тексты первого экрана",
  );
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  /** Сохранить первый экран. */
  async function save() {
    if (!draft || saving) return;
    setSaving(true);

    try {
      setDraft(await saveHeroContent(draft));
      toast("Первый экран сохранён");
    } catch (error) {
      toast(errorMessage(error, "Не удалось сохранить первый экран"), "error");
    } finally {
      setSaving(false);
    }
  }

  return { fields: draft, failed, retry, saving, change, save };
}
