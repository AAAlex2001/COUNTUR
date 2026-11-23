import type { HeroContent } from "@/entities/landing";
import { adminRequest, jsonBody } from "@/shared/api";

export const fetchHeroContent = (signal: AbortSignal) =>
  adminRequest<HeroContent>("/landing/hero/content", { signal });

export const saveHeroContent = (content: HeroContent) =>
  adminRequest<HeroContent>("/landing/hero/content", jsonBody("PUT", content));
