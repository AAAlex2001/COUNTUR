import Link from "next/link";
import styles from "./style.module.scss";

export type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
};

/** Хлебные крошки. Последний пункт — текущая страница, он не ссылка. */
const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
    <ol className={styles.list}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <li className={styles.item} key={item.label}>
            {item.href && !isLast ? (
              <Link className={styles.crumb} href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
            )}

            {!isLast && <span aria-hidden="true">/</span>}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
