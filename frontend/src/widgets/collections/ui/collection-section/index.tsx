import { collectionPath, type Collection } from "@/entities/collection";
import { ProductCard, type ProductActions } from "@/entities/product";
import SectionHeading from "@/shared/ui/section-heading";
import Slider from "@/shared/ui/slider";
import styles from "./style.module.scss";

type CollectionSectionProps = {
  actions: ProductActions;
  collection: Collection;
};

/** Показать подборку товаров. */
const CollectionSection = ({ collection, actions }: CollectionSectionProps) => (
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
        <ProductCard key={product.id} product={product} actions={actions} />
      ))}
    />
  </section>
);

export default CollectionSection;
