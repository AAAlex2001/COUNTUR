"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";

/** Загрузить черновик редактора. */
export function useAdminDraft<T>(load: (signal: AbortSignal) => Promise<T>, failureMessage: string) {
  const [draft, setDraft] = useState<T | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const toast = useToast();

  /** Сообщить об ошибке загрузки. */
  const reportFailure = useEffectEvent((error: unknown) => {
    setFailed(true);
    toast(errorMessage(error, failureMessage), "error");
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    load(signal)
      .then((data) => {
        if (!signal.aborted) setDraft(data);
      })
      .catch((error) => {
        if (!signal.aborted) reportFailure(error);
      });

    return () => controller.abort();
  }, [load, attempt]);

  /** Повторить загрузку черновика. */
  function retry() {
    setFailed(false);
    setAttempt((previous) => previous + 1);
  }

  /** Изменить поля черновика. */
  function change(fields: Partial<T>) {
    setDraft((current) => current && { ...current, ...fields });
  }

  return { draft, setDraft, change, failed, retry };
}
