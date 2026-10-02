"use client";

import Link from "next/link";
import { useCart } from "@/entities/cart";
import { formatRub } from "@/shared/lib/money";
import { CartIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Ссылка на корзину в шапке: сумма и количество товаров. */
const CartLink = () => {
  const { cart } = useCart();
  const total = formatRub(cart.total);

  return (
    <Link
      className={styles.cart}
      href="/cart"
      aria-label={`Корзина: товаров — ${cart.total_quantity}, на сумму ${total}`}
    >
      <CartIcon className={styles.icon} />
      <span className={styles.total}>{total}</span>
      {cart.total_quantity > 0 && <span className={styles.count}>{cart.total_quantity}</span>}
    </Link>
  );
};

export default CartLink;
