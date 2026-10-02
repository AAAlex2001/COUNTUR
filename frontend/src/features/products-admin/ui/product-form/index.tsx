"use client";

import type { Brand } from "@/entities/product";
import Button from "@/shared/ui/button";
import { useProductForm } from "../../model/use-product-form";
import type { AdminCategory, AdminProduct } from "../../model/types";
import DescriptionFields from "../description-fields";
import ImageGrid from "../image-grid";
import MainFields from "../main-fields";
import PriceFields from "../price-fields";
import SpecFields from "../spec-fields";
import styles from "./style.module.scss";

type ProductFormProps = {
  categories: AdminCategory[];
  brands: Brand[];
  product: AdminProduct | null;
  onSaved: (product: AdminProduct) => void;
};

/** Форма товара. У нового товара фото выбираются здесь же и загружаются при создании. */
const ProductForm = ({ categories, brands, product, onSaved }: ProductFormProps) => {
  const { state, category, change, addDrafts, moveDraft, removeDraft, save } = useProductForm(
    product,
    categories,
    onSaved,
  );
  const { fields } = state;

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      {!product && (
        <ImageGrid
          images={state.drafts}
          onAdd={addDrafts}
          onMove={moveDraft}
          onRemove={removeDraft}
        />
      )}

      <MainFields fields={fields} categories={categories} brands={brands} onChange={change} />
      <PriceFields fields={fields} onChange={change} />
      <DescriptionFields fields={fields} onChange={change} />

      {category && category.attributes.length > 0 && (
        <SpecFields fields={fields} attributes={category.attributes} onChange={change} />
      )}

      <Button className={styles.submit} type="submit" loading={state.pending} disabled={!category}>
        {product ? "Сохранить" : "Создать товар"}
      </Button>
    </form>
  );
};

export default ProductForm;
