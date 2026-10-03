"use client";

import {
  CollectionActions,
  CollectionForm,
  useCollectionEditor,
} from "@/features/collections-admin";
import BackButton from "@/shared/ui/back-button";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

type CollectionEditorProps = {
  collectionId?: number;
};

/** Страница подборки в админке. Без collectionId — новая подборка. */
const CollectionEditor = ({ collectionId }: CollectionEditorProps) => {
  const { state, changeCollection } = useCollectionEditor(collectionId);
  const { collection } = state;

  if (state.status === "loading") {
    return <Loader size="lg" />;
  }

  if (state.status === "failed") {
    return <p className={styles.error}>Не удалось загрузить подборку.</p>;
  }

  return (
    <section className={styles.editor}>
      <BackButton className={styles.back} />

      <div className={styles.header}>
        <h1 className={styles.title}>{collection?.title ?? "Новая подборка"}</h1>
        {collection && <CollectionActions collection={collection} />}
      </div>

      <CollectionForm collection={collection} onSaved={changeCollection} />
    </section>
  );
};

export default CollectionEditor;
