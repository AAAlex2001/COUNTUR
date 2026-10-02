"use client";

import { useCart } from "@/entities/cart";
import { CATALOG_PATH } from "@/entities/product";
import { CartItemRow } from "@/features/cart-item";
import { plural } from "@/shared/lib/text";
import Button from "@/shared/ui/button";
import EmptyState from "@/shared/ui/empty-state";
import { CartIcon } from "@/shared/ui/icons";
import Summary from "./ui/summary";
import styles from "./style.module.scss";

/** Страница корзины: список товаров и блок «Итого» либо сообщение, что корзина пуста. */
const Cart = () => {
  const { cart, loaded } = useCart();
  const positions = cart.items.length;
  const isEmpty = positions === 0;

  return (
    <section className={styles.cart}>
      <div className={styles.header}>
        <div className={styles.titles}>
          <p className={styles.eyebrow}>Ваш заказ</p>
          <h1 className={styles.title}>Корзина</h1>
        </div>

        {!isEmpty && (
          <p className={styles.counts}>
            {positions} {plural(positions, ["позиция", "позиции", "позиций"])} ·{" "}
            {cart.total_quantity} {plural(cart.total_quantity, ["товар", "товара", "товаров"])}
          </p>
        )}
      </div>

      {!loaded && <p className={styles.loading}>Загружаем корзину…</p>}

      {loaded && isEmpty && (
        <EmptyState
          icon={<CartIcon />}
          title="В корзине пока пусто"
          text="Добавьте комплектующие из каталога — поможем проверить совместимость."
          action={
            <Button variant="outline" href={CATALOG_PATH}>
              Перейти в каталог
            </Button>
          }
        />
      )}

      {loaded && !isEmpty && (
        <div className={styles.columns}>
          <ul className={styles.items}>
            {cart.items.map((item) => (
              <li key={item.product.id}>
                <CartItemRow item={item} />
              </li>
            ))}
          </ul>

          <Summary className={styles.summary} cart={cart} />
        </div>
      )}
    </section>
  );
};

export default Cart;
