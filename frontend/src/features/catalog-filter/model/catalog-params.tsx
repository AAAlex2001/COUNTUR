"use client";

import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import { createContext, useContext, useTransition, type ReactNode } from "react";
import { CATALOG_PATH } from "@/entities/product";

type ParamChanges = Record<string, string | string[] | null>;

type CatalogParamsValue = {
  searchParams: ReadonlyURLSearchParams;
  pending: boolean;
  update: (changes: ParamChanges) => void;
};

const CatalogParamsContext = createContext<CatalogParamsValue | null>(null);

type CatalogParamsProviderProps = {
  children: ReactNode;
};

/** Параметры каталога в адресе страницы: чтение, изменение и признак загрузки новой выдачи. */
export const CatalogParamsProvider = ({ children }: CatalogParamsProviderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

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

    startTransition(() => {
      router.push(`${CATALOG_PATH}?${params}`, { scroll: "page" in changes });
    });
  };

  return (
    <CatalogParamsContext.Provider value={{ searchParams, pending, update }}>
      {children}
    </CatalogParamsContext.Provider>
  );
};

/** Параметры каталога из CatalogParamsProvider. */
export const useCatalogParams = (): CatalogParamsValue => {
  const value = useContext(CatalogParamsContext);

  if (!value) {
    throw new Error("useCatalogParams можно вызывать только внутри CatalogParamsProvider");
  }

  return value;
};
