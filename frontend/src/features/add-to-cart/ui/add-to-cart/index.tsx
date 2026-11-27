"use client";

import cn from "classnames";
import Button from "@/shared/ui/button";
import { CartIcon } from "@/shared/ui/icons";
import QuantityStepper from "@/shared/ui/quantity-stepper";
import { useAddToCart } from "../../model/use-add-to-cart";
import styles from "./style.module.scss";

type AddToCartProps = {
  productId: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  className?: string;
};

/** Добавить выбранное количество. */
const AddToCart = ({
  productId,
  quantity,
  onQuantityChange,
  className,
}: AddToCartProps) => {
  const { state, add } = useAddToCart(productId);

  /** Сохранить количество в корзине. */
  const submit = async () => {
    const added = await add(quantity);

    if (added) onQuantityChange(1);
  };

  return (
    <div className={cn(styles.controls, className)}>
      <QuantityStepper value={quantity} disabled={state.pending} onChange={onQuantityChange} />

      <Button className={styles.submit} loading={state.pending} onClick={submit}>
        <CartIcon className={styles.icon} />
        <span className={styles.short}>В корзину</span>
        <span className={styles.full}>Добавить в корзину</span>
      </Button>
    </div>
  );
};

export default AddToCart;
