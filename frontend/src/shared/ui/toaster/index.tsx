"use client";

import cn from "classnames";
import { createContext, useContext, useState, type ReactNode } from "react";
import styles from "./style.module.scss";

const HEADER_GAP = 15;

type Tone = "success" | "error";

type Toast = {
  id: number;
  text: string;
  tone: Tone;
  top: number;
};

type ShowToast = (text: string, tone?: Tone) => void;

const ToastContext = createContext<ShowToast>(() => undefined);

/** Показывает уведомление справа под шапкой. Оно само уезжает, когда добегает полоска времени. */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const show: ShowToast = (text, tone = "success") => {
    const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;

    setToast({ id: Date.now(), text, tone, top: header + HEADER_GAP });
  };

  return (
    <ToastContext.Provider value={show}>
      {children}

      {toast && (
        <div
          key={toast.id}
          className={cn(styles.toast, styles[toast.tone])}
          style={{ top: toast.top }}
          role="status"
          onAnimationEnd={() => setToast(null)}
        >
          <span className={styles.icon}>{toast.tone === "success" ? "✓" : "!"}</span>
          <p className={styles.text}>{toast.text}</p>
          <span className={styles.timer} />
        </div>
      )}
    </ToastContext.Provider>
  );
};

/** Функция показа уведомления: toast("Сохранено") или toast("Не удалось", "error"). */
export const useToast = () => useContext(ToastContext);
