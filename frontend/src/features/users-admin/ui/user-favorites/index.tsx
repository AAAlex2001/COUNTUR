"use client";

import { AVAILABILITY_LABELS } from "@/entities/product";
import { fetchUserFavorites } from "../../api/users";
import { usePagedList } from "../../model/use-paged-list";
import PagedPanel from "../paged-panel";
import ProductRow from "../product-row";

type UserFavoritesProps = {
  userId: number;
};

/** Избранное покупателя: товары с наличием и текущей ценой. */
const UserFavorites = ({ userId }: UserFavoritesProps) => {
  const { state, pages, openPage } = usePagedList(fetchUserFavorites, userId);

  return (
    <PagedPanel
      title="Избранное"
      unit={["товар", "товара", "товаров"]}
      empty="В избранном пусто."
      state={state}
      pages={pages}
      onPage={openPage}
    >
      {state.items.map((product) => (
        <ProductRow
          key={product.id}
          image={product.image_url}
          name={product.name}
          slug={product.slug}
          meta={`${product.category.name} · ${AVAILABILITY_LABELS[product.availability]}`}
          price={product.price}
        />
      ))}
    </PagedPanel>
  );
};

export default UserFavorites;
