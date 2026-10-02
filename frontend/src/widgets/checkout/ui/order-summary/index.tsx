import cn from "classnames";
import Image from "next/image";
import type { Cart } from "@/entities/cart";
import { formatRub } from "@/shared/lib/money";
import { FREE_DELIVERY_FROM } from "../../data";
import styles from "./style.module.scss";

type OrderSummaryProps = {
  cart: Cart;
  className?: string;
};

/** Блок «Ваш заказ»: состав корзины, доставка и итоговая сумма. */
const OrderSummary = ({ cart, className }: OrderSummaryProps) => {
  const freeDelivery = Number(cart.total) >= FREE_DELIVERY_FROM;

  return (
    <aside className={cn(styles.summary, className)} aria-label="Ваш заказ">
      <h2 className={styles.title}>Ваш заказ</h2>

      <ul className={styles.items}>
        {cart.items.map((item) => (
          <li className={styles.item} key={item.product.id}>
            <span className={styles.image}>
              {item.product.image_url && (
                <Image
                  src={item.product.image_url}
                  alt=""
                  fill
                  sizes="44px"
                  unoptimized
                  className={styles.photo}
                />
              )}
            </span>

            <span className={styles.label}>
              {item.product.name} × {item.quantity}
            </span>
          </li>
        ))}
      </ul>

      <hr className={styles.divider} />

      <div className={styles.row}>
        <span className={styles.label}>Товары</span>
        <span className={styles.value}>{formatRub(cart.total)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Доставка</span>
        <span className={cn(styles.value, freeDelivery && styles.free)}>
          {freeDelivery ? "Бесплатно" : "На шаге доставки"}
        </span>
      </div>

      <hr className={cn(styles.divider, styles.strong)} />

      <div className={styles.row}>
        <span className={styles.title}>Итого</span>
        <span className={styles.total}>{formatRub(cart.total)}</span>
      </div>
    </aside>
  );
};

export default OrderSummary;
