import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { formatRub } from "@/shared/lib/money";
import type { CartItem as CartItemType } from "../../model/types";
import styles from "./style.module.scss";

const SHOWN_HIGHLIGHTS = 2;

type CartItemProps = {
  item: CartItemType;
  href: string;
  status: ReactNode;
  quantity: ReactNode;
  remove: ReactNode;
  error?: string | null;
};

/** Строка корзины. Наличие, количество и удаление передаются готовыми блоками. */
const CartItem = ({ item, href, status, quantity, remove, error }: CartItemProps) => {
  const { product } = item;
  const specs = product.highlights.slice(0, SHOWN_HIGHLIGHTS).join(" · ");

  return (
    <article className={styles.item}>
      <Link className={styles.image} href={href} aria-label={product.name}>
        {product.image_url && (
          <Image
            src={product.image_url}
            alt=""
            fill
            sizes="142px"
            unoptimized
            className={styles.photo}
          />
        )}
      </Link>

      <div className={styles.content}>
        <div className={styles.info}>
          {product.brand && <span className={styles.brand}>{product.brand.name}</span>}

          <Link className={styles.name} href={href}>
            {product.name}
          </Link>

          {specs && <span className={styles.specs}>{specs}</span>}

          {status}
        </div>

        {quantity}

        <div className={styles.price}>
          <span className={styles.subtotal}>{formatRub(item.subtotal)}</span>
          {remove}
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    </article>
  );
};

export default CartItem;
