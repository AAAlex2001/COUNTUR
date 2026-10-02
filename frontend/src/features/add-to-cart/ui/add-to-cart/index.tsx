"use client";

import cn from "classnames";
import Button from "@/shared/ui/button";
import { CartIcon } from "@/shared/ui/icons";
import QuantityStepper from "@/shared/ui/quantity-stepper";
import { useAddToCart } from "../../model/use-add-to-cart";
import styles from "./style.module.scss";

type AddToCartProps = {
  productId: number;
  available: boolean;
  unavailableLabel: string;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  className?: string;
};

/** Выбор количества и кнопка «Добавить в корзину» для страницы товара. */
const AddToCart = ({
  productId,
  available,
  unavailableLabel,
  quantity,
  onQuantityChange,
  className,
}: AddToCartProps) => {
  const { pending, added, error, add } = useAddToCart(productId);

  if (!available) {
    return (
      <div className={cn(styles.root, className)}>
        <Button disabled>{unavailableLabel}</Button>
      </div>
    );
  }

  const submit = async () => {
    const isAdded = await add(quantity);

    if (isAdded) onQuantityChange(1);
  };

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.controls}>
        <QuantityStepper value={quantity} disabled={pending} onChange={onQuantityChange} />

        <Button className={styles.submit} disabled={pending} onClick={submit}>
          <CartIcon className={styles.icon} />
          {added ? "Добавлено" : "Добавить в корзину"}
        </Button>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default AddToCart;
