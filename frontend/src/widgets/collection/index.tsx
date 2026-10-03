import { COLLECTIONS_PATH, type Collection } from "@/entities/collection";
import { ProductCard } from "@/entities/product";
import { AddToCartButton } from "@/features/add-to-cart";
import { FavoriteButton } from "@/features/toggle-favorite";
import { plural } from "@/shared/lib/text";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import styles from "./style.module.scss";

type CollectionPageProps = {
  collection: Collection;
};

/** Страница подборки: заголовок, описание и все её товары сеткой. */
const CollectionPage = ({ collection }: CollectionPageProps) => {
  const count = collection.products.length;

  return (
    <section className={styles.collection}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Готовые подборки", href: COLLECTIONS_PATH },
          { label: collection.title },
        ]}
      />

      <div className={styles.header}>
        <div className={styles.titles}>
          <p className={styles.eyebrow}>Готовая подборка</p>
          <h1 className={styles.title}>{collection.title}</h1>
          {collection.description && (
            <p className={styles.description}>{collection.description}</p>
          )}
        </div>

        <p className={styles.count}>
          {count} {plural(count, ["товар", "товара", "товаров"])}
        </p>
      </div>

      <hr className={styles.divider} />

      <ul className={styles.grid}>
        {collection.products.map((product) => (
          <li key={product.id}>
            <ProductCard
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
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CollectionPage;
