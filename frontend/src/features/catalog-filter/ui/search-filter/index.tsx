"use client";

import { useRef, useState } from "react";
import { SearchIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import { useCatalogParams } from "../../model/catalog-params";
import styles from "./style.module.scss";

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

type SearchFilterProps = {
  className?: string;
};

/** Поиск по каталогу от двух символов: запрос уходит в адрес через паузу после ввода или сразу по Enter. */
const SearchFilter = ({ className }: SearchFilterProps) => {
  const { searchParams, update } = useCatalogParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  /** Записать запрос в адрес. Короче двух символов — поиск снимается. */
  const apply = (text: string) => {
    clearTimeout(timer.current);

    const query = text.trim().length >= MIN_QUERY_LENGTH ? text.trim() : "";

    if (query !== (searchParams.get("q") ?? "")) update({ q: query || null });
  };

  const change = (text: string) => {
    setValue(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => apply(text), DEBOUNCE_MS);
  };

  return (
    <form
      className={className}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        apply(value);
      }}
    >
      <Input
        className={styles.field}
        type="search"
        placeholder="Поиск по каталогу…"
        ariaLabel="Поиск по каталогу"
        maxLength={100}
        autoComplete="off"
        icon={<SearchIcon />}
        value={value}
        onChange={change}
      />
    </form>
  );
};

export default SearchFilter;
