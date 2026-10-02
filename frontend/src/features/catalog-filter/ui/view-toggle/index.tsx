"use client";

import cn from "classnames";
import type { CatalogView } from "@/entities/product";
import { GridIcon, ListIcon } from "@/shared/ui/icons";
import { useCatalogParams } from "../../model/catalog-params";
import styles from "./style.module.scss";

const VIEWS = [
  { value: "grid", label: "Показать плиткой", Icon: GridIcon },
  { value: "list", label: "Показать списком", Icon: ListIcon },
];

type ViewToggleProps = {
  view: CatalogView;
};

/** Переключатель вида каталога: плитка или список. */
const ViewToggle = ({ view }: ViewToggleProps) => {
  const { update } = useCatalogParams();

  return (
    <div className={styles.toggle} role="group" aria-label="Вид списка товаров">
      {VIEWS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          className={cn(styles.button, view === value && styles.active)}
          aria-label={label}
          aria-pressed={view === value}
          onClick={() => update({ view: value })}
        >
          <Icon className={styles.icon} />
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;
