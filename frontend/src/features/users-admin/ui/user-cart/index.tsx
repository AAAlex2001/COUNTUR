"use client";

import { formatRub } from "@/shared/lib/money";
import { fetchUserCart } from "../../api/users";
import { usePagedList } from "../../model/use-paged-list";
import PagedPanel from "../paged-panel";
import ProductRow from "../product-row";

type UserCartProps = {
  userId: number;
};

/** Корзина покупателя: товары, количество и стоимость строк. */
const UserCart = ({ userId }: UserCartProps) => {
  const { state, pages, openPage } = usePagedList(fetchUserCart, userId);

  return (
    <PagedPanel
      title="Корзина"
      unit={["позиция", "позиции", "позиций"]}
      empty="Корзина пуста."
      state={state}
      pages={pages}
      onPage={openPage}
    >
      {state.items.map((item) => (
        <ProductRow
          key={item.product.id}
          image={item.product.image_url}
          name={item.product.name}
          slug={item.product.slug}
          meta={`${item.quantity} × ${formatRub(item.product.price)}`}
          price={item.subtotal}
        />
      ))}
    </PagedPanel>
  );
};

export default UserCart;
