import cn from "classnames";
import Link from "next/link";
import { adminCollectionPath } from "@/shared/lib/admin-paths";
import { plural } from "@/shared/lib/text";
import type { AdminCollection } from "../../model/types";
import styles from "./style.module.scss";

type CollectionsTableProps = {
  collections: AdminCollection[];
};

/** Где показывается подборка, одной строкой. */
const placements = (collection: AdminCollection) =>
  [collection.show_on_home && "главная", collection.show_in_catalog && "каталог"]
    .filter(Boolean)
    .join(" · ") || "нигде";

/** Список подборок админки. Строка целиком ведёт на редактирование. */
const CollectionsTable = ({ collections }: CollectionsTableProps) => (
  <ul className={styles.table}>
    {collections.map((collection) => (
      <li key={collection.id}>
        <Link className={styles.row} href={adminCollectionPath(collection.id)}>
          <span className={styles.info}>
            <span className={styles.title}>{collection.title}</span>
            <span className={styles.meta}>
              {collection.product_ids.length}{" "}
              {plural(collection.product_ids.length, ["товар", "товара", "товаров"])} ·{" "}
              {placements(collection)}
            </span>
          </span>

          <span className={cn(styles.status, collection.is_active && styles.active)}>
            {collection.is_active ? "Включена" : "Выключена"}
          </span>
        </Link>
      </li>
    ))}
  </ul>
);

export default CollectionsTable;
