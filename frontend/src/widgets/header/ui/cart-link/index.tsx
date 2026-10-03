"use client";

import { useCart } from "@/entities/cart";
import { formatRub } from "@/shared/lib/money";
import { CartIcon } from "@/shared/ui/icons";
import NavLink from "../nav-link";
import styles from "./style.module.scss";

/** Ссылка на корзину в шапке: сумма и количество товаров. */
const CartLink = () => {
  const { cart } = useCart();
  const total = formatRub(cart.total);

  return (
    <NavLink
      className={styles.cart}
      href="/cart"
      ariaLabel={`Корзина: товаров — ${cart.total_quantity}, на сумму ${total}`}
    >
      <CartIcon className={styles.icon} />
      <span className={styles.total}>{total}</span>
      {cart.total_quantity > 0 && <span className={styles.count}>{cart.total_quantity}</span>}
    </NavLink>
  );
};

export default CartLink;
