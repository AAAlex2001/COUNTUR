import styles from "./style.module.scss";

export type Requisite = {
  label: string;
  value: string;
  href?: string;
};

type RequisitesCardProps = {
  title: string;
  items: Requisite[];
  note?: string;
};

/** Карточка реквизитов: подпись и значение в столбик, ссылочные значения голубые. */
const RequisitesCard = ({ title, items, note }: RequisitesCardProps) => (
  <dl className={styles.card}>
    <p className={styles.title}>{title}</p>

    {items.map((item) => (
      <div className={styles.item} key={item.label}>
        <dt className={styles.label}>{item.label}</dt>
        <dd className={styles.value}>
          {item.href ? (
            <a className={styles.link} href={item.href}>
              {item.value}
            </a>
          ) : (
            item.value
          )}
        </dd>
      </div>
    ))}

    {note && <p className={styles.note}>{note}</p>}
  </dl>
);

export default RequisitesCard;
