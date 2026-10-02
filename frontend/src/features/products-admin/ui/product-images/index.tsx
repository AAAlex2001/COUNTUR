"use client";

import { useProductImages } from "../../model/use-product-images";
import type { AdminProduct } from "../../model/types";
import ImageGrid from "../image-grid";

type ProductImagesProps = {
  product: AdminProduct;
  onChange: (product: AdminProduct) => void;
};

/** Фото существующего товара. Каждое изменение сразу уходит на сервер. */
const ProductImages = ({ product, onChange }: ProductImagesProps) => {
  const { state, upload, move, remove } = useProductImages(product, onChange);

  return (
    <ImageGrid
      images={product.images}
      pending={state.pending}
      onAdd={upload}
      onMove={move}
      onRemove={remove}
    />
  );
};

export default ProductImages;
