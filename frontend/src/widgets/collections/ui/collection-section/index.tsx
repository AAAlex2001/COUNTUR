import { collectionPath, type Collection } from "@/entities/collection";
import { ProductCard } from "@/entities/product";
import { AddToCartButton } from "@/features/add-to-cart";
import { FavoriteButton } from "@/features/toggle-favorite";
import SectionHeading from "@/shared/ui/section-heading";
import Slider from "@/shared/ui/slider";
import styles from "./style.module.scss";

type CollectionSectionProps = {
  collection: Collection;
};

/** Блок одной подборки: заголовок как у «Хитов продаж» и слайдер её товаров. */
const CollectionSection = ({ collection }: CollectionSectionProps) => (
  <section className={styles.section}>
    <SectionHeading
      eyebrow="Готовая подборка"
      title={collection.title}
      actionLabel="Смотреть все"
      actionHref={collectionPath(collection.slug)}
    />

    {collection.description && <p className={styles.description}>{collection.description}</p>}

    <Slider
      slides={collection.products.map((product) => (
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

export default CollectionSection;
