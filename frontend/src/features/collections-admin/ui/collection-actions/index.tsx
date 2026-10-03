"use client";

import { collectionPath } from "@/entities/collection";
import Button from "@/shared/ui/button";
import ConfirmModal from "@/shared/ui/confirm-modal";
import { useCollectionActions } from "../../model/use-collection-actions";
import type { AdminCollection } from "../../model/types";
import styles from "./style.module.scss";

type CollectionActionsProps = {
  collection: AdminCollection;
};

/** Кнопки подборки в админке: открыть на сайте и удалить. */
const CollectionActions = ({ collection }: CollectionActionsProps) => {
  const { state, remove, askRemove, cancelRemove } = useCollectionActions(collection);

  return (
    <div className={styles.actions}>
      {collection.is_active && (
        <Button variant="outline" href={collectionPath(collection.slug)}>
          Открыть на сайте
        </Button>
      )}

      <Button variant="danger" disabled={state.pending} onClick={askRemove}>
        Удалить
      </Button>

      <ConfirmModal
        open={state.confirming}
        title="Удалить подборку?"
        text={`«${collection.title}» пропадёт с сайта. Товары останутся в каталоге.`}
        confirmLabel="Удалить"
        pending={state.pending}
        onConfirm={remove}
        onCancel={cancelRemove}
      />
    </div>
  );
};

export default CollectionActions;
