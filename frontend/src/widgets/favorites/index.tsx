"use client";

import { useFavorites } from "@/entities/favorite";
import { CATALOG_PATH, ProductCard } from "@/entities/product";
import { ACCOUNT_PATH, useUser } from "@/entities/user";
import { AddToCartButton } from "@/features/add-to-cart";
import { LoginPrompt } from "@/features/auth";
import { FavoriteButton } from "@/features/toggle-favorite";
import { plural } from "@/shared/lib/text";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import Button from "@/shared/ui/button";
import EmptyState from "@/shared/ui/empty-state";
import { HeartIcon } from "@/shared/ui/icons";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** Страница избранного. Товар исчезает из списка сразу, как только его убрали сердечком. */
const Favorites = () => {
  const { user } = useUser();
  const { products: favorites, loaded } = useFavorites();
  const isEmpty = favorites.length === 0;

  return (
    <section className={styles.favorites}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Личный кабинет", href: ACCOUNT_PATH },
          { label: "Избранное" },
        ]}
      />

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

      {!loaded && <Loader size="lg" />}

      {loaded && !user && (
        <LoginPrompt
          title="Избранное хранится в аккаунте"
          text="Войдите, чтобы сохранять товары и возвращаться к ним с любого устройства."
        />
      )}

      {loaded && user && isEmpty && (
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

      {loaded && user && !isEmpty && (
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
