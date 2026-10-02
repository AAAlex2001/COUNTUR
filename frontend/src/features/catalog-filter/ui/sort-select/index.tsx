"use client";

import { SORT_OPTIONS } from "@/entities/product";
import Dropdown from "@/shared/ui/dropdown";
import { useCatalogParams } from "../../model/catalog-params";

type SortSelectProps = {
  className?: string;
};

/** Выбор сортировки каталога. Значение хранится в адресе. */
const SortSelect = ({ className }: SortSelectProps) => {
  const { searchParams, update } = useCatalogParams();

  return (
    <Dropdown
      className={className}
      value={searchParams.get("sort") ?? "popular"}
      options={SORT_OPTIONS}
      onChange={(sort) => update({ sort })}
    />
  );
};

export default SortSelect;
