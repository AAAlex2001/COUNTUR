"use client";

import IconButton from "@/shared/ui/icon-button";
import { BellIcon, CartIcon } from "@/shared/ui/icons";
import { useAddToCart } from "../../model/use-add-to-cart";

type AddToCartButtonProps = {
  productId: number;
  productName: string;
  available: boolean;
};

/** Кнопка-иконка «в корзину» для карточки товара. Добавляет одну штуку. */
const AddToCartButton = ({ productId, productName, available }: AddToCartButtonProps) => {
  const { pending, error, add } = useAddToCart(productId);

  if (!available) {
    return (
      <IconButton tone="muted" ariaLabel={`${productName}: нет в наличии`} disabled>
        <BellIcon />
      </IconButton>
    );
  }

  return (
    <IconButton
      ariaLabel={`Добавить в корзину: ${productName}`}
      title={error ?? undefined}
      disabled={pending}
      onClick={() => add(1)}
    >
      <CartIcon />
    </IconButton>
  );
};

export default AddToCartButton;
