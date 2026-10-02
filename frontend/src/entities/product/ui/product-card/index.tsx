import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { formatRub } from "@/shared/lib/money";
import Badge from "@/shared/ui/badge";
import { cardSpecLines } from "../../lib/card";
import { productPath } from "../../lib/paths";
import type { CatalogView, ProductCardData } from "../../model/types";
import Rating from "../rating";
import StockStatus from "../stock-status";
import styles from "./style.module.scss";

const IMAGE_SIZES = "(min-width: 1440px) 262px, (min-width: 768px) 330px, 100vw";

type ProductCardProps = {
  product: ProductCardData;
  action?: ReactNode;
  view?: CatalogView;
};

/** Карточка товара в списке. action — кнопки рядом с ценой. */
const ProductCard = ({ product, action, view = "grid" }: ProductCardProps) => {
  const href = productPath(product.slug);

  return (
    <article className={cn(styles.card, view === "list" && styles.list)}>
      <Link className={styles.media} href={href} aria-label={product.name}>
        {product.image_url && (
          <Image
            src={product.image_url}
            alt=""
            fill
            sizes={IMAGE_SIZES}
            unoptimized
            className={styles.image}
          />
        )}

        <span className={styles.badges}>
          {product.is_hit && <Badge>Хит</Badge>}
          {product.discount_percent !== null && (
            <Badge tone="sale">−{product.discount_percent}%</Badge>
          )}
        </span>
      </Link>

      <div className={styles.body}>
        {product.brand && <span className={styles.brand}>{product.brand.name}</span>}

        <Link className={styles.name} href={href}>
          {product.name}
        </Link>

        <Rating rating={product.rating} reviewsCount={product.reviews_count} compact />

        <ul className={styles.specs}>
          {cardSpecLines(product.highlights).map((line) => (
            <li className={styles.spec} key={line}>
              — {line}
            </li>
          ))}
        </ul>

        <div className={styles.priceRow}>
          <div className={styles.prices}>
            {product.old_price && (
              <span className={styles.oldPrice}>{formatRub(product.old_price)}</span>
            )}
            <span className={styles.price}>{formatRub(product.price)}</span>
          </div>

          {action}
        </div>

        <StockStatus availability={product.availability} size="sm" />
      </div>
    </article>
  );
};

export default ProductCard;
