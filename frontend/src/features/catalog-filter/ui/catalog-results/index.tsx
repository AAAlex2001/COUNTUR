"use client";

import type { ReactNode } from "react";
import LoadingArea from "@/shared/ui/loading-area";
import { useCatalogParams } from "../../model/catalog-params";

type CatalogResultsProps = {
  children: ReactNode;
  className?: string;
};

/** Выдача каталога. Пока грузится новая, показывает поверх лоадер. */
const CatalogResults = ({ children, className }: CatalogResultsProps) => {
  const { pending } = useCatalogParams();

  return (
    <LoadingArea className={className} loading={pending}>
      {children}
    </LoadingArea>
  );
};

export default CatalogResults;
