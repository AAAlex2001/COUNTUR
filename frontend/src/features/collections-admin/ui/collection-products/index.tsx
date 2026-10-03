"use client";

import Image from "next/image";
import type { ProductCardData } from "@/entities/product";
import { formatRub } from "@/shared/lib/money";
import { plural } from "@/shared/lib/text";
import IconButton from "@/shared/ui/icon-button";
import { TrashIcon } from "@/shared/ui/icons";
import Panel from "@/shared/ui/panel";
import ProductPicker from "../product-picker";
import styles from "./style.module.scss";

type CollectionProductsProps = {
  products: ProductCardData[];
  onAdd: (product: ProductCardData) => void;
  onRemove: (productId: number) => void;
};

/** Состав подборки: поиск для добавления и список выбранных товаров с удалением. */
const CollectionProducts = ({ products, onAdd, onRemove }: CollectionProductsProps) => (
  <Panel
    title="Состав"
    action={
      products.length > 0 && (
        <span className={styles.count}>
          {products.length} {plural(products.length, ["товар", "товара", "товаров"])}
        </span>
      )
    }
  >
    <ProductPicker chosenIds={products.map((product) => product.id)} onPick={onAdd} />

    {products.length === 0 && (
      <p className={styles.empty}>Пока пусто — найдите товар выше и добавьте его.</p>
    )}

    <ul className={styles.list}>
      {products.map((product) => (
        <li className={styles.row} key={product.id}>
          <span className={styles.image}>
            {product.image_url && (
              <Image
                src={product.image_url}
                alt=""
                fill
                sizes="48px"
                unoptimized
                className={styles.photo}
              />
            )}
          </span>

          <span className={styles.info}>
            <span className={styles.name}>{product.name}</span>
            <span className={styles.meta}>{product.category.name}</span>
          </span>

          <span className={styles.price}>{formatRub(product.price)}</span>

          <IconButton tone="outline" ariaLabel="Убрать из подборки" onClick={() => onRemove(product.id)}>
            <TrashIcon />
          </IconButton>
        </li>
      ))}
    </ul>
  </Panel>
);

export default CollectionProducts;
