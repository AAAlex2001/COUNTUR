"use client";

import cn from "classnames";
import { useState } from "react";
import { CATALOG_PATH, type CatalogFilters, type Category } from "@/entities/product";
import Button from "@/shared/ui/button";
import Modal from "@/shared/ui/modal";
import FilterList from "../filter-list";
import styles from "./style.module.scss";

type FiltersProps = {
  categories: Category[];
  filters: CatalogFilters;
  className?: string;
};

/** Фильтры каталога: панель слева на широком экране, кнопка с модальным окном на узком. */
const Filters = ({ categories, filters, className }: FiltersProps) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className={cn(styles.filters, className)}>
      <Button className={styles.openButton} variant="outline" onClick={() => setOpen(true)}>
        Фильтры
      </Button>

      <Modal
        open={open}
        title="Фильтры"
        onClose={close}
        footer={
          <>
            <Button className={styles.footerButton} variant="outline" href={CATALOG_PATH}>
              Сбросить
            </Button>
            <Button className={styles.footerButton} onClick={close}>
              Показать товары
            </Button>
          </>
        }
      >
        {open && <FilterList categories={categories} filters={filters} />}
      </Modal>

      <aside className={styles.panel} aria-label="Фильтры каталога">
        <div className={styles.head}>
          <p className={styles.title}>Фильтры</p>
          <Button variant="ghost" href={CATALOG_PATH}>
            Сбросить
          </Button>
        </div>

        <hr className={styles.divider} />

        <FilterList categories={categories} filters={filters} />
      </aside>
    </div>
  );
};

export default Filters;
