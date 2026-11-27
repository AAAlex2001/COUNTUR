import cn from "classnames";
import Link from "next/link";
import type { Cart } from "@/entities/cart";
import { formatRub } from "@/shared/lib/money";
import Button from "@/shared/ui/button";
import { ArrowRightIcon } from "@/shared/ui/icons";
import { CHECKOUT_PATH, TRUST_MESSAGES } from "../../data";
import styles from "./style.module.scss";

type SummaryProps = {
  cart: Cart;
  className?: string;
};

/** Показать итог корзины. */
const Summary = ({ cart, className }: SummaryProps) => (
  <aside className={cn(styles.summary, className)} aria-label="Итог заказа">
    <h2 className={styles.title}>Итого</h2>

    <div className={styles.row}>
      <span className={styles.label}>Подытог</span>
      <span className={styles.value}>{formatRub(cart.total)}</span>
    </div>

    <div className={styles.row}>
      <span className={styles.label}>Доставка</span>
      <span className={styles.note}>при оформлении</span>
    </div>

    <hr className={styles.divider} />

    <div className={styles.totalRow}>
      <span className={styles.totalLabel}>К оплате</span>
      <span className={styles.total}>{formatRub(cart.total)}</span>
    </div>

    <Button href={CHECKOUT_PATH}>
      <ArrowRightIcon className={styles.buttonIcon} />
      Оформить заказ
    </Button>

    <ul className={styles.trust}>
      {TRUST_MESSAGES.map(({ Icon, text, href, newTab }) => (
        <li className={styles.trustItem} key={text}>
          <Icon className={styles.trustIcon} />
          {href ? (
            <Link
              className={styles.trustLink}
              href={href}
              target={newTab ? "_blank" : undefined}
              rel={newTab ? "noopener noreferrer" : undefined}
            >
              {text}
            </Link>
          ) : text}
        </li>
      ))}
    </ul>
  </aside>
);

export default Summary;
