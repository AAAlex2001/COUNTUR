"use client";

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
  const { state, changeQuantity, remove, askRemove, cancelRemove } = useCartItem(product.id);

  return (
    <>
      <CartItemCard
        item={item}
        href={productPath(product.slug)}
        status={<StockStatus availability={product.availability} size="sm" />}
        quantity={
          <QuantityStepper
            size="sm"
            value={item.quantity}
            disabled={state.pending}
            onChange={changeQuantity}
          />
        }
        remove={
          <IconButton
            tone="danger"
            size="sm"
            ariaLabel={`Удалить из корзины: ${product.name}`}
            loading={state.pending}
            onClick={askRemove}
          >
            <TrashIcon />
          </IconButton>
        }
      />

      <ConfirmModal
        open={state.confirming}
        title="Удалить товар?"
        text={`«${product.name}» будет удалён из корзины.`}
        confirmLabel="Удалить"
        onConfirm={remove}
        onCancel={cancelRemove}
      />
    </>
  );
};

export default CartItemRow;
