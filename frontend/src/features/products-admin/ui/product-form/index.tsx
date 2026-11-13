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
  onCategoryChange: (category: AdminCategory) => void;
};

/** Форма товара. У нового товара фото выбираются здесь же и загружаются при создании. */
const ProductForm = ({
  categories,
  brands,
  product,
  onSaved,
  onCategoryChange,
}: ProductFormProps) => {
  const { state, category, errors, change, addDrafts, moveDraft, removeDraft, save } = useProductForm(
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

      <MainFields
        fields={fields}
        errors={errors}
        categories={categories}
        brands={brands}
        onChange={change}
      />
      <PriceFields fields={fields} errors={errors} onChange={change} />
      <DescriptionFields fields={fields} errors={errors} onChange={change} />

      {category && (
        <SpecFields
          fields={fields}
          category={category}
          onChange={change}
          onCategoryChange={onCategoryChange}
        />
      )}

      <Button className={styles.submit} type="submit" loading={state.pending}>
        {product ? "Сохранить" : "Создать товар"}
      </Button>
    </form>
  );
};

export default ProductForm;
