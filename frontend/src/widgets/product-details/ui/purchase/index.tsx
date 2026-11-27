"use client";

import { useState } from "react";
import type { Product } from "@/entities/product";
import { AddToCart } from "@/features/add-to-cart";
import { StockBell } from "@/features/notify-on-stock";
import { FavoriteButton } from "@/features/toggle-favorite";
import { formatRub } from "@/shared/lib/money";
import styles from "./style.module.scss";

type PurchaseProps = {
  product: Pick<Product, "id" | "name" | "price" | "old_price" | "discount_percent" | "availability">;
};

/** Выбрать товар для покупки. */
const Purchase = ({ product }: PurchaseProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className={styles.purchase}>
      <div className={styles.summary}>
        <div className={styles.price}>
          <span className={styles.priceValue}>{formatRub(Number(product.price) * quantity)}</span>

          {product.old_price && (
            <span className={styles.oldPrice}>
              {formatRub(Number(product.old_price) * quantity)}
            </span>
          )}

          {product.discount_percent !== null && (
            <span className={styles.discount}>−{product.discount_percent}%</span>
          )}
        </div>

        {quantity > 1 && (
          <p className={styles.unit}>
            {quantity} шт. × {formatRub(product.price)}
          </p>
        )}
      </div>

      <div className={styles.actions}>
        {product.availability === "in_stock" ? (
          <AddToCart
            className={styles.addToCart}
            productId={product.id}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
        ) : (
          <StockBell productId={product.id} productName={product.name} />
        )}
        <FavoriteButton productId={product.id} />
      </div>
    </div>
  );
};

export default Purchase;
