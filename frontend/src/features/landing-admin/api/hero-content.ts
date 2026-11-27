import type { HeroContent } from "@/entities/landing";
import { adminRequest, jsonBody } from "@/shared/api";

/** Загружает содержимое первого экрана для редактирования. */
export const fetchHeroContent = (signal: AbortSignal) =>
  adminRequest<HeroContent>("/landing/hero/content", { signal });

/** Публикует тексты, кнопки и показатели первого экрана. */
export const saveHeroContent = (content: HeroContent) =>
  adminRequest<HeroContent>("/landing/hero/content", jsonBody("PUT", content));
