import { CATALOG_PATH } from "@/entities/product";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import Button from "@/shared/ui/button";
import styles from "./style.module.scss";

type CollectionsHeadingProps = {
  empty: boolean;
};

/** Шапка страницы подборок. Без подборок — подсказка и ссылка в каталог. */
const CollectionsHeading = ({ empty }: CollectionsHeadingProps) => (
  <div className={styles.heading}>
    <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Готовые подборки" }]} />

    <div className={styles.titles}>
      <h1 className={styles.title}>Готовые подборки</h1>
      <p className={styles.subtitle}>Комплектующие, которые хорошо работают вместе</p>
    </div>

    <hr className={styles.divider} />

    {empty && (
      <div className={styles.empty}>
        <p className={styles.emptyText}>Подборок пока нет — загляните в каталог.</p>
        <Button href={CATALOG_PATH}>В каталог</Button>
      </div>
    )}
  </div>
);

export default CollectionsHeading;
