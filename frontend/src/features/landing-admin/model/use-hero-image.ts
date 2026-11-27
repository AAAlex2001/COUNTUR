"use client";

import { useState } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useAdminDraft } from "@/shared/lib/use-admin-draft";
import { useToast } from "@/shared/ui/toaster";
import { deleteHeroImage, fetchHero, uploadHeroImage } from "../api/hero";

/** Редактировать картинку первого экрана. */
export function useHeroImage() {
  const { draft, setDraft, failed, retry } = useAdminDraft(fetchHero, "Не удалось загрузить картинку");
  const [pending, setPending] = useState(false);
  const toast = useToast();

  /** Заменить картинку. */
  async function upload(files: File[]) {
    const file = files[0];
    if (!draft || !file || pending) return;
    setPending(true);

    try {
      setDraft(await uploadHeroImage(file));
      toast("Картинка обновлена");
    } catch (error) {
      toast(errorMessage(error, "Не удалось загрузить картинку"), "error");
    } finally {
      setPending(false);
    }
  }

  /** Удалить картинку. */
  async function remove() {
    if (!draft?.image_url || pending) return false;
    setPending(true);

    try {
      setDraft(await deleteHeroImage());
      toast("Картинка удалена");
      return true;
    } catch (error) {
      toast(errorMessage(error, "Не удалось удалить картинку"), "error");
      return false;
    } finally {
      setPending(false);
    }
  }

  return { hero: draft, pending, failed, retry, upload, remove };
}
