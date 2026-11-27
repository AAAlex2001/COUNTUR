"use client";

import IconButton from "@/shared/ui/icon-button";
import { CartIcon } from "@/shared/ui/icons";
import { useAddToCart } from "../../model/use-add-to-cart";

type AddToCartButtonProps = {
  productId: number;
  productName: string;
};

/** Добавить товар в корзину. */
const AddToCartButton = ({ productId, productName }: AddToCartButtonProps) => {
  const { state, add } = useAddToCart(productId);

  return (
    <IconButton
      ariaLabel={`Добавить в корзину: ${productName}`}
      loading={state.pending}
      onClick={() => add(1)}
    >
      <CartIcon />
    </IconButton>
  );
};

export default AddToCartButton;
