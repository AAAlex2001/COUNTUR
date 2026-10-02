"use client";

import type { CatalogFilters, Category } from "@/entities/product";
import { useCatalogParams } from "../../model/catalog-params";
import CheckboxFilter from "../checkbox-filter";
import PriceFilter from "../price-filter";
import styles from "./style.module.scss";

type FilterListProps = {
  categories: Category[];
  filters: CatalogFilters;
};

/** Все фильтры каталога по порядку: категории, цена, наличие, бренды, характеристики. */
const FilterList = ({ categories, filters }: FilterListProps) => {
  const { searchParams } = useCatalogParams();
  const minPrice = Math.floor(Number(filters.price_min));
  const maxPrice = Math.ceil(Number(filters.price_max));

  return (
    <div className={styles.list}>
      <CheckboxFilter
        title="Категория"
        name="category"
        allLabel="Все товары"
        resets={["brand", "spec"]}
        options={categories.map((category) => ({
          value: category.slug,
          label: category.name,
          count: category.products_count,
        }))}
      />

      <hr className={styles.divider} />

      {maxPrice > minPrice && (
        <>
          <PriceFilter key={searchParams.toString()} min={minPrice} max={maxPrice} />
          <hr className={styles.divider} />
        </>
      )}

      <CheckboxFilter name="in_stock" options={[{ value: "true", label: "Только в наличии" }]} />

      <CheckboxFilter
        title="Бренд"
        name="brand"
        options={filters.brands.map((brand) => ({ value: brand.slug, label: brand.name }))}
      />

      {filters.attributes.map((attribute) => (
        <CheckboxFilter
          key={attribute.id}
          title={attribute.name}
          name="spec"
          options={attribute.values.map((value) => ({
            value: `${attribute.id}:${value}`,
            label: value,
          }))}
        />
      ))}
    </div>
  );
};

export default FilterList;
