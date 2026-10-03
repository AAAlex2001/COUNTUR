import { CATALOG_PATH, ProductCard, type ProductCardData } from "@/entities/product";
import { AddToCartButton } from "@/features/add-to-cart";
import { FavoriteButton } from "@/features/toggle-favorite";
import SectionHeading from "@/shared/ui/section-heading";
import Slider from "@/shared/ui/slider";
import styles from "./style.module.scss";

type HitsProps = {
  products: ProductCardData[];
};

/** Блок главной «Хиты продаж»: слайдер из хитов и товаров со скидкой. */
const Hits = ({ products }: HitsProps) => (
  <section className={styles.hits}>
    <SectionHeading
      eyebrow="Популярное"
      title="Хиты продаж"
      actionLabel="Смотреть все"
      actionHref={CATALOG_PATH}
    />

    <Slider
      slides={products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          action={
            <div className={styles.actions}>
              <FavoriteButton productId={product.id} size="md" />
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                available={product.availability === "in_stock"}
              />
            </div>
          }
        />
      ))}
    />
  </section>
);

export default Hits;
