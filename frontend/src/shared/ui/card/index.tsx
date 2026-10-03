import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type CardProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  id?: string;
  className?: string;
};

/** Карточка раздела страницы с крупным заголовком. Справа от заголовка может стоять действие. */
const Card = ({ title, children, action, id, className }: CardProps) => (
  <section id={id} className={cn(styles.card, className)}>
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {action}
    </div>

    {children}
  </section>
);

export default Card;
