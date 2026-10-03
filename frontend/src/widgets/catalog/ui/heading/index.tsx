import type { ReactNode } from "react";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import styles from "./style.module.scss";

type CatalogHeadingProps = {
  children?: ReactNode;
};

/** Шапка каталога: хлебные крошки, заголовок и место под сортировку справа. */
const CatalogHeading = ({ children }: CatalogHeadingProps) => (
  <>
    <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Каталог" }]} />

    <div className={styles.header}>
      <div className={styles.titles}>
        <h1 className={styles.title}>Каталог комплектующих</h1>
        <p className={styles.subtitle}>Всё необходимое для производительной сборки</p>
      </div>

      {children}
    </div>

    <hr className={styles.divider} />
  </>
);

export default CatalogHeading;
