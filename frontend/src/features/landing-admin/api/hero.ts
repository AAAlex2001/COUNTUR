import type { Hero } from "@/entities/landing";
import { API_URL, adminRequest, readErrorMessage } from "@/shared/api";

/** Первый экран главной страницы. */
export const fetchHero = async (): Promise<Hero> => {
  const response = await fetch(`${API_URL}/v1/landing/hero`);

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response.json();
};

/** Заменить картинку первого экрана. */
export const uploadHeroImage = (file: File) => {
  const body = new FormData();

  body.append("file", file);

  return adminRequest<Hero>("/landing/hero/image", { method: "PUT", body });
};
