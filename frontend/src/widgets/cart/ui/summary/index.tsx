import cn from "classnames";
import type { Cart } from "@/entities/cart";
import { TELEGRAM_SUPPORT_URL } from "@/shared/config/telegram";
import { formatRub } from "@/shared/lib/money";
import Button from "@/shared/ui/button";
import { ArrowRightIcon } from "@/shared/ui/icons";
import { CHECKOUT_PATH, TRUST_MESSAGES } from "../../data";
import styles from "./style.module.scss";

type SummaryProps = {
  cart: Cart;
  className?: string;
};

/** Блок «Итого» в корзине: сумма, кнопка оформления и гарантии магазина. */
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
      {TRUST_MESSAGES.map(({ Icon, text, linkToSupport }) => (
        <li className={styles.trustItem} key={text}>
          <Icon className={styles.trustIcon} />
          {linkToSupport ? (
            <a href={TELEGRAM_SUPPORT_URL} target="_blank" rel="noopener noreferrer">{text}</a>
          ) : text}
        </li>
      ))}
    </ul>
  </aside>
);

export default Summary;
