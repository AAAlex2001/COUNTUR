"use client";

import type { ProductActionsProps } from "@/entities/product";
import { AddToCartButton } from "@/features/add-to-cart";
import { StockBell } from "@/features/notify-on-stock";
import { FavoriteButton } from "@/features/toggle-favorite";
import styles from "./style.module.scss";

/** Показать действия с товаром. */
export default function ProductCardActions({ id, name, availability }: ProductActionsProps) {
  return (
    <div className={styles.actions}>
      <FavoriteButton productId={id} size="md" />
      {availability === "in_stock" ? (
        <AddToCartButton productId={id} productName={name} />
      ) : (
        <StockBell productId={id} productName={name} size="md" />
      )}
    </div>
  );
}
