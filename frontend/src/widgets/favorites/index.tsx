"use client";

import { useFavorites } from "@/entities/favorite";
import { CATALOG_PATH, ProductCard } from "@/entities/product";
import { AddToCartButton } from "@/features/add-to-cart";
import { FavoriteButton } from "@/features/toggle-favorite";
import { plural } from "@/shared/lib/text";
import Button from "@/shared/ui/button";
import EmptyState from "@/shared/ui/empty-state";
import { HeartIcon } from "@/shared/ui/icons";
import { useFavoriteProducts } from "./model/use-favorite-products";
import styles from "./style.module.scss";

/** Страница избранного. Товар исчезает из списка сразу, как только его убрали сердечком. */
const Favorites = () => {
  const { ids, loaded: idsLoaded } = useFavorites();
  const { products, loaded: productsLoaded } = useFavoriteProducts();

  const favorites = products.filter((product) => ids.includes(product.id));
  const loaded = idsLoaded && productsLoaded;
  const isEmpty = favorites.length === 0;

  return (
    <section className={styles.favorites}>
      <div className={styles.header}>
        <div className={styles.titles}>
          <p className={styles.eyebrow}>Ваш список</p>
          <h1 className={styles.title}>Избранное</h1>
        </div>

        {!isEmpty && (
          <p className={styles.count}>
            {favorites.length} {plural(favorites.length, ["товар", "товара", "товаров"])}
          </p>
        )}
      </div>

      {!loaded && <p className={styles.loading}>Загружаем избранное…</p>}

      {loaded && isEmpty && (
        <EmptyState
          icon={<HeartIcon />}
          title="В избранном пока пусто"
          text="Нажмите на сердечко на странице товара — он появится здесь."
          action={
            <Button variant="outline" href={CATALOG_PATH}>
              Перейти в каталог
            </Button>
          }
        />
      )}

      {loaded && !isEmpty && (
        <ul className={styles.grid}>
          {favorites.map((product) => (
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
      )}
    </section>
  );
};

export default Favorites;
