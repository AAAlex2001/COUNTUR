"use client";

import { CollectionsTable, useCollectionsList } from "@/features/collections-admin";
import { ADMIN_NEW_COLLECTION_PATH } from "@/shared/lib/admin-paths";
import Button from "@/shared/ui/button";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** Страница админки с подборками: список и кнопка добавления. */
const AdminCollections = () => {
  const { collections, failed } = useCollectionsList();

  return (
    <section className={styles.collections}>
      <div className={styles.header}>
        <h1 className={styles.title}>Подборки</h1>
        <Button href={ADMIN_NEW_COLLECTION_PATH}>Добавить подборку</Button>
      </div>

      {failed && <p className={styles.error}>Не удалось загрузить подборки.</p>}

      {!collections && !failed && <Loader size="lg" />}

      {collections && collections.length === 0 && (
        <p className={styles.empty}>Подборок пока нет — соберите первую.</p>
      )}

      {collections && <CollectionsTable collections={collections} />}
    </section>
  );
};

export default AdminCollections;
