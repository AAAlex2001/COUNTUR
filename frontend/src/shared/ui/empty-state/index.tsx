import type { ReactNode } from "react";
import styles from "./style.module.scss";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
};

/** Блок «здесь пока пусто»: иконка, заголовок, текст и кнопка. */
const EmptyState = ({ icon, title, text, action }: EmptyStateProps) => (
  <div className={styles.empty}>
    <span className={styles.circle} aria-hidden="true">
      {icon}
    </span>

    <div className={styles.texts}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
    </div>

    {action}
  </div>
);

export default EmptyState;
