"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATALOG_PATH } from "@/entities/product";

type ParamChanges = Record<string, string | string[] | null>;

/** Параметры каталога в адресе страницы: чтение и изменение. */
export const useCatalogParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Открыть каталог с новыми значениями параметров. null убирает параметр.
   * Любое изменение, кроме самой страницы, возвращает на первую страницу.
   */
  const update = (changes: ParamChanges) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    for (const [name, value] of Object.entries(changes)) {
      params.delete(name);

      for (const item of [value ?? []].flat()) {
        params.append(name, item);
      }
    }

    router.push(`${CATALOG_PATH}?${params}`, { scroll: "page" in changes });
  };

  return { searchParams, update };
};
