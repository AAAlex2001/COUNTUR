"use client";

import { useState } from "react";
import Input from "@/shared/ui/input";
import RangeSlider, { type Range } from "@/shared/ui/range-slider";
import { useCatalogParams } from "../../model/use-catalog-params";
import FilterGroup from "../filter-group";
import styles from "./style.module.scss";

const SLIDER_STEP = 10;

/** Число из текста поля: всё, кроме цифр, отбрасывается. */
const toNumber = (text: string): number => Number(text.replace(/\D/g, ""));

type PriceFilterProps = {
  min: number;
  max: number;
};

/** Фильтр по цене: поля «от» и «до» и ползунок между границами каталога. */
const PriceFilter = ({ min, max }: PriceFilterProps) => {
  const { searchParams, update } = useCatalogParams();

  const [range, setRange] = useState<Range>([
    Number(searchParams.get("price_min") ?? min),
    Number(searchParams.get("price_max") ?? max),
  ]);
  const [low, high] = range;

  /** Записать диапазон в адрес. Значение на границе каталога фильтром не считается. */
  const apply = () =>
    update({
      price_min: low > min ? String(low) : null,
      price_max: high < max ? String(high) : null,
    });

  return (
    <FilterGroup title="Цена, ₽">
      <div className={styles.inputs}>
        <Input
          className={styles.input}
          size="sm"
          prefix="от"
          inputMode="numeric"
          ariaLabel="Цена от"
          value={String(low)}
          onChange={(text) => setRange([toNumber(text), high])}
          onBlur={apply}
        />
        <Input
          className={styles.input}
          size="sm"
          prefix="до"
          inputMode="numeric"
          ariaLabel="Цена до"
          value={String(high)}
          onChange={(text) => setRange([low, toNumber(text)])}
          onBlur={apply}
        />
      </div>

      <RangeSlider
        min={min}
        max={max}
        step={SLIDER_STEP}
        value={range}
        onChange={setRange}
        onCommit={apply}
      />
    </FilterGroup>
  );
};

export default PriceFilter;
