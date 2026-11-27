import { CATALOG_PATH, ProductCard, type ProductActions, type ProductCardData } from "@/entities/product";
import SectionHeading from "@/shared/ui/section-heading";
import Slider from "@/shared/ui/slider";
import styles from "./style.module.scss";

type HitsProps = {
  actions: ProductActions;
  products: ProductCardData[];
};

/** Показать хиты продаж. */
const Hits = ({ products, actions }: HitsProps) => (
  <section className={styles.hits}>
    <SectionHeading
      eyebrow="Популярное"
      title="Хиты продаж"
      actionLabel="Смотреть все"
      actionHref={CATALOG_PATH}
    />

    <Slider
      slides={products.map((product) => (
        <ProductCard key={product.id} product={product} actions={actions} />
      ))}
    />
  </section>
);

export default Hits;
