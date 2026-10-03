import Image from "next/image";
import Link from "next/link";
import { productPath } from "@/entities/product";
import { formatRub } from "@/shared/lib/money";
import styles from "./style.module.scss";

type ProductRowProps = {
  image: string | null;
  name: string;
  meta: string;
  price: string;
  slug?: string;
};

/** Строка товара в списках покупателя: фото, название со ссылкой на сайт, подпись и цена. */
const ProductRow = ({ image, name, meta, price, slug }: ProductRowProps) => (
  <li className={styles.row}>
    <span className={styles.image}>
      {image && <Image src={image} alt="" fill sizes="56px" unoptimized className={styles.photo} />}
    </span>

    <span className={styles.info}>
      {slug ? (
        <Link className={styles.name} href={productPath(slug)} target="_blank">
          {name}
        </Link>
      ) : (
        <span className={styles.name}>{name}</span>
      )}
      <span className={styles.meta}>{meta}</span>
    </span>

    <span className={styles.price}>{formatRub(price)}</span>
  </li>
);

export default ProductRow;
