"use client";

import { productPath } from "@/entities/product";
import Button from "@/shared/ui/button";
import ConfirmModal from "@/shared/ui/confirm-modal";
import { useProductActions } from "../../model/use-product-actions";
import type { AdminProduct } from "../../model/types";
import styles from "./style.module.scss";

type ProductActionsProps = {
  product: AdminProduct;
  onChange: (product: AdminProduct) => void;
};

/** Кнопки товара в админке: открыть на сайте, опубликовать или снять, удалить. */
const ProductActions = ({ product, onChange }: ProductActionsProps) => {
  const { state, published, togglePublication, remove, askRemove, cancelRemove } =
    useProductActions(product, onChange);

  return (
    <div className={styles.actions}>
      {published && (
        <Button variant="outline" href={productPath(product.slug)}>
          Открыть на сайте
        </Button>
      )}

      <Button variant="outline" loading={state.pending} onClick={togglePublication}>
        {published ? "Снять с публикации" : "Опубликовать"}
      </Button>

      <Button variant="danger" disabled={state.pending} onClick={askRemove}>
        Удалить
      </Button>

      <ConfirmModal
        open={state.confirming}
        title="Удалить товар?"
        text={`«${product.name}» будет удалён вместе с фото.`}
        confirmLabel="Удалить"
        onConfirm={remove}
        onCancel={cancelRemove}
      />
    </div>
  );
};

export default ProductActions;
