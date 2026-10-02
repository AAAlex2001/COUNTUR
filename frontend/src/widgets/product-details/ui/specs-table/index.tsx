import type { ProductSpec } from "@/entities/product";
import styles from "./style.module.scss";

type SpecsTableProps = {
  specs: ProductSpec[];
};

/** Таблица характеристик товара: группа, название параметра, значение. */
const SpecsTable = ({ specs }: SpecsTableProps) => {
  if (specs.length === 0) {
    return <p className={styles.empty}>Характеристики пока не указаны.</p>;
  }

  return (
    <dl className={styles.table}>
      {specs.map((spec) => (
        <div className={styles.row} key={spec.attribute_id}>
          <dt className={styles.term}>
            <span className={styles.group}>{spec.group}</span>
            <span className={styles.name}>{spec.name}</span>
          </dt>
          <dd className={styles.value}>{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default SpecsTable;
