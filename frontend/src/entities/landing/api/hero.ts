import { load } from "@/shared/api/server";
import type { Hero } from "../model/types";

/** Первый экран главной страницы. Картинку для него загружают в админке. */
export const getHero = (): Promise<Hero> => load("/v1/landing/hero", { image_url: null });
