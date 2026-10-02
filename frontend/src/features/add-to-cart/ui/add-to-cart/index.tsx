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
  const { state, add } = useAddToCart(productId);

  if (!available) {
    return (
      <Button className={className} disabled>
        {unavailableLabel}
      </Button>
    );
  }

  const submit = async () => {
    const added = await add(quantity);

    if (added) onQuantityChange(1);
  };

  return (
    <div className={cn(styles.controls, className)}>
      <QuantityStepper value={quantity} disabled={state.pending} onChange={onQuantityChange} />

      <Button className={styles.submit} loading={state.pending} onClick={submit}>
        <CartIcon className={styles.icon} />
        Добавить в корзину
      </Button>
    </div>
  );
};

export default AddToCart;
