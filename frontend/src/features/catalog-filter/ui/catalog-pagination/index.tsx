"use client";

import Pagination from "@/shared/ui/pagination";
import { useCatalogParams } from "../../model/catalog-params";

type CatalogPaginationProps = {
  pages: number;
  className?: string;
};

/** Листалка страниц каталога. Номер страницы хранится в адресе. */
const CatalogPagination = ({ pages, className }: CatalogPaginationProps) => {
  const { searchParams, update } = useCatalogParams();

  return (
    <Pagination
      className={className}
      page={Number(searchParams.get("page")) || 1}
      pages={pages}
      onChange={(page) => update({ page: String(page) })}
    />
  );
};

export default CatalogPagination;
