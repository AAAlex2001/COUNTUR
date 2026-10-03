"use client";

import Link from "next/link";
import { ADMIN_NEW_COLLECTION_PATH, adminCollectionPath } from "@/shared/lib/admin-paths";
import Button from "@/shared/ui/button";
import Loader from "@/shared/ui/loader";
import Panel from "@/shared/ui/panel";
import { useCollectionsList } from "../../model/use-collections-list";
import styles from "./style.module.scss";

type ProductCollectionsProps = {
  productId: number;
};

/** Подборки, в которые входит товар. Состав меняется на странице подборки. */
const ProductCollections = ({ productId }: ProductCollectionsProps) => {
  const { collections, failed } = useCollectionsList();
  const included = collections?.filter((collection) => collection.product_ids.includes(productId));

  return (
    <Panel
      title="Подборки"
      action={
        <Button variant="ghost" size="sm" href={ADMIN_NEW_COLLECTION_PATH}>
          Новая подборка
        </Button>
      }
    >
      {failed && <p className={styles.error}>Не удалось загрузить подборки.</p>}

      {!included && !failed && <Loader className={styles.loader} />}

      {included && included.length === 0 && (
        <p className={styles.empty}>Товар пока не входит ни в одну подборку.</p>
      )}

      {included && included.length > 0 && (
        <ul className={styles.list}>
          {included.map((collection) => (
            <li key={collection.id}>
              <Link className={styles.link} href={adminCollectionPath(collection.id)}>
                {collection.title}
                {!collection.is_active && <span className={styles.off}>выключена</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

export default ProductCollections;
