"use client";

import cn from "classnames";
import { useState } from "react";
import type { ProductSpec, ReviewList } from "@/entities/product";
import { ProductReviews } from "@/features/product-reviews";
import SpecsTable from "../specs-table";
import styles from "./style.module.scss";

type ProductTabsProps = {
  slug: string;
  specs: ProductSpec[];
  description: string | null;
  reviews: ReviewList;
};

/** Вкладки страницы товара: характеристики, описание и отзывы. */
const ProductTabs = ({ slug, specs, description, reviews }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("specs");

  const tabs = [
    { id: "specs", label: "Характеристики" },
    { id: "description", label: "Описание" },
    { id: "reviews", label: `Отзывы ${reviews.total || ""}` },
  ];

  return (
    <div className={styles.tabs}>
      <div className={styles.list} role="tablist" aria-label="Информация о товаре">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={cn(styles.tab, activeTab === tab.id && styles.active)}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {activeTab === "specs" && <SpecsTable specs={specs} />}

        {activeTab === "description" && (
          <div className={styles.description}>{description || "Описание пока не добавлено."}</div>
        )}

        {activeTab === "reviews" && <ProductReviews slug={slug} initial={reviews} />}
      </div>
    </div>
  );
};

export default ProductTabs;
