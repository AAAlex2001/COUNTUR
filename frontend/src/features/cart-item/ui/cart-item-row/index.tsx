"use client";

import { useState } from "react";
import { CartItemCard, type CartItem } from "@/entities/cart";
import { StockStatus, productPath } from "@/entities/product";
import ConfirmModal from "@/shared/ui/confirm-modal";
import IconButton from "@/shared/ui/icon-button";
import { TrashIcon } from "@/shared/ui/icons";
import QuantityStepper from "@/shared/ui/quantity-stepper";
import { useCartItem } from "../../model/use-cart-item";

type CartItemRowProps = {
  item: CartItem;
};

/** Строка корзины с изменением количества и удалением через подтверждение. */
const CartItemRow = ({ item }: CartItemRowProps) => {
  const { product } = item;
  const { pending, error, changeQuantity, remove } = useCartItem(product.id);
  const [confirming, setConfirming] = useState(false);

  const confirmRemove = async () => {
    await remove();
    setConfirming(false);
  };

  return (
    <>
      <CartItemCard
        item={item}
        href={productPath(product.slug)}
        error={error}
        status={<StockStatus availability={product.availability} size="sm" />}
        quantity={
          <QuantityStepper
            size="sm"
            value={item.quantity}
            disabled={pending}
            onChange={changeQuantity}
          />
        }
        remove={
          <IconButton
            tone="danger"
            size="sm"
            ariaLabel={`Удалить из корзины: ${product.name}`}
            loading={pending}
            onClick={() => setConfirming(true)}
          >
            <TrashIcon />
          </IconButton>
        }
      />

      <ConfirmModal
        open={confirming}
        title="Удалить товар?"
        text={`«${product.name}» будет удалён из корзины.`}
        confirmLabel="Удалить"
        pending={pending}
        onConfirm={confirmRemove}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
};

export default CartItemRow;
