"use client";

import { ProductCollections } from "@/features/collections-admin";
import {
  ProductActions,
  ProductForm,
  ProductImages,
  StatusLabel,
  useProductEditor,
} from "@/features/products-admin";
import { ReviewsManager } from "@/features/reviews-admin";
import { formatShortDate } from "@/shared/lib/date";
import BackButton from "@/shared/ui/back-button";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

type ProductEditorProps = {
  productId?: number;
};

/** Страница товара в админке: фото, поля, публикация, подборки и отзывы. Без productId — новый товар. */
const ProductEditor = ({ productId }: ProductEditorProps) => {
  const { state, changeProduct, changeCategory } = useProductEditor(productId);
  const { product } = state;

  if (state.status === "loading") {
    return <Loader size="lg" />;
  }

  if (state.status === "failed") {
    return <p className={styles.error}>Не удалось загрузить товар.</p>;
  }

  return (
    <section className={styles.editor}>
      <BackButton className={styles.back} />

      <div className={styles.header}>
        <div className={styles.titles}>
          <h1 className={styles.title}>{product?.name ?? "Новый товар"}</h1>

          {product && (
            <div className={styles.meta}>
              <StatusLabel status={product.status} />
              <span className={styles.dates}>
                ID {product.id} · создан {formatShortDate(product.created_at)} · изменён{" "}
                {formatShortDate(product.updated_at)}
              </span>
            </div>
          )}
        </div>

        {product && <ProductActions product={product} onChange={changeProduct} />}
      </div>

      {product && <ProductImages product={product} onChange={changeProduct} />}

      <ProductForm
        categories={state.categories}
        brands={state.brands}
        product={product}
        onSaved={changeProduct}
        onCategoryChange={changeCategory}
      />

      {product && <ProductCollections productId={product.id} />}
      {product && <ReviewsManager productId={product.id} />}
    </section>
  );
};

export default ProductEditor;
