"use client";

import { useEffect, type RefObject } from "react";

/** Вызвать onOutside при клике мимо элемента. */
export const useClickOutside = (ref: RefObject<HTMLElement | null>, onOutside: () => void) => {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onOutside();
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  });
};
