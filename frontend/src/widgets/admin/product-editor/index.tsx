"use client";

import {
  ProductActions,
  ProductForm,
  ProductImages,
  StatusLabel,
  useProductEditor,
} from "@/features/products-admin";
import { ReviewsManager } from "@/features/reviews-admin";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

type ProductEditorProps = {
  productId?: number;
};

/** Страница товара в админке: фото, поля, публикация и отзывы. Без productId — новый товар. */
const ProductEditor = ({ productId }: ProductEditorProps) => {
  const { state, changeProduct } = useProductEditor(productId);
  const { product } = state;

  if (state.status === "loading") {
    return <Loader size="lg" />;
  }

  if (state.status === "failed") {
    return <p className={styles.error}>Не удалось загрузить товар.</p>;
  }

  return (
    <section className={styles.editor}>
      <div className={styles.header}>
        <div className={styles.titles}>
          <h1 className={styles.title}>{product?.name ?? "Новый товар"}</h1>
          {product && <StatusLabel status={product.status} />}
        </div>

        {product && <ProductActions product={product} onChange={changeProduct} />}
      </div>

      {product && <ProductImages product={product} onChange={changeProduct} />}

      <ProductForm
        categories={state.categories}
        brands={state.brands}
        product={product}
        onSaved={changeProduct}
      />

      {product && <ReviewsManager productId={product.id} />}
    </section>
  );
};

export default ProductEditor;
