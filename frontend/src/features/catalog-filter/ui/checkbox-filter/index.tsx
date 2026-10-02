"use client";

import Checkbox from "@/shared/ui/checkbox";
import { useCatalogParams } from "../../model/catalog-params";
import FilterGroup from "../filter-group";

type Option = {
  value: string;
  label: string;
  count?: number;
};

type CheckboxFilterProps = {
  name: string;
  options: Option[];
  title?: string;
  allLabel?: string;
  resets?: string[];
};

/**
 * Фильтр из галочек по одному параметру адреса.
 * allLabel добавляет галочку «всё», resets — параметры, которые сбрасываются при выборе.
 */
const CheckboxFilter = ({ name, options, title, allLabel, resets = [] }: CheckboxFilterProps) => {
  const { searchParams, update } = useCatalogParams();
  const selected = searchParams.getAll(name);
  const cleared = Object.fromEntries(resets.map((reset) => [reset, null]));

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    update({ ...cleared, [name]: next });
  };

  if (options.length === 0) return null;

  return (
    <FilterGroup title={title}>
      {allLabel && (
        <Checkbox
          checked={selected.length === 0}
          onChange={() => update({ ...cleared, [name]: null })}
        >
          {allLabel}
        </Checkbox>
      )}

      {options.map((option) => (
        <Checkbox
          key={option.value}
          checked={selected.includes(option.value)}
          count={option.count}
          onChange={() => toggle(option.value)}
        >
          {option.label}
        </Checkbox>
      ))}
    </FilterGroup>
  );
};

export default CheckboxFilter;
