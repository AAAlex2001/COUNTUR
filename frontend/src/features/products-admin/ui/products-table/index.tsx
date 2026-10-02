import Image from "next/image";
import Link from "next/link";
import { AVAILABILITY_LABELS } from "@/entities/product";
import { adminProductPath } from "@/shared/lib/admin-paths";
import { formatRub } from "@/shared/lib/money";
import type { AdminProduct } from "../../model/types";
import StatusLabel from "../status-label";
import styles from "./style.module.scss";

type ProductsTableProps = {
  products: AdminProduct[];
};

/** Список товаров админки. Строка целиком ведёт на редактирование товара. */
const ProductsTable = ({ products }: ProductsTableProps) => (
  <ul className={styles.table}>
    {products.map((product) => (
      <li key={product.id}>
        <Link className={styles.row} href={adminProductPath(product.id)}>
          <span className={styles.image}>
            {product.image_url && (
              <Image
                src={product.image_url}
                alt=""
                fill
                sizes="56px"
                unoptimized
                className={styles.photo}
              />
            )}
          </span>

          <span className={styles.info}>
            <span className={styles.name}>{product.name}</span>
            <span className={styles.meta}>
              {product.category.name}
              {product.sku && ` · ${product.sku}`}
            </span>
          </span>

          <span className={styles.state}>
            <StatusLabel status={product.status} />
            <span className={styles.meta}>{AVAILABILITY_LABELS[product.availability]}</span>
          </span>

          <span className={styles.price}>{formatRub(product.price)}</span>
        </Link>
      </li>
    ))}
  </ul>
);

export default ProductsTable;
