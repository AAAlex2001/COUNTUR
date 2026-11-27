"use client";

import { useState } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useAdminDraft } from "@/shared/lib/use-admin-draft";
import { useToast } from "@/shared/ui/toaster";
import { fetchPromotion, savePromotion, uploadPromotionImage } from "../api/promotion";

/** Редактировать акцию магазина. */
export function usePromotion() {
  const { draft, setDraft, change, failed, retry } = useAdminDraft(fetchPromotion, "Не удалось загрузить акцию");
  const [pending, setPending] = useState(false);
  const toast = useToast();

  /** Опубликовать акцию. */
  async function save() {
    if (!draft || pending) return;
    setPending(true);

    try {
      setDraft(await savePromotion(draft));
      toast(draft.is_visible ? "Блок сохранён и показан на главной" : "Блок сохранён");
    } catch (error) {
      toast(errorMessage(error, "Не удалось сохранить блок"), "error");
    } finally {
      setPending(false);
    }
  }

  /** Заменить изображение акции. */
  async function uploadImage(files: File[]) {
    const file = files[0];
    if (!draft || !file || pending) return;
    setPending(true);

    try {
      const promotion = await uploadPromotionImage(file);
      change({ image_url: promotion.image_url });
      toast("Картинка обновлена");
    } catch (error) {
      toast(errorMessage(error, "Не удалось загрузить картинку"), "error");
    } finally {
      setPending(false);
    }
  }

  return { fields: draft, failed, retry, pending, change, save, uploadImage };
}
