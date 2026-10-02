"use client";

import IconButton from "@/shared/ui/icon-button";
import { HeartIcon } from "@/shared/ui/icons";
import { useToggleFavorite } from "../../model/use-toggle-favorite";

type FavoriteButtonProps = {
  productId: number;
  size?: "lg" | "md";
  className?: string;
};

/** Кнопка-сердечко: добавляет товар в избранное или убирает из него. */
const FavoriteButton = ({ productId, size = "lg", className }: FavoriteButtonProps) => {
  const { state, active, toggle } = useToggleFavorite(productId);

  return (
    <IconButton
      className={className}
      tone="outline"
      size={size}
      pressed={active}
      ariaLabel={active ? "Убрать из избранного" : "Добавить в избранное"}
      loading={state.pending}
      onClick={toggle}
    >
      <HeartIcon />
    </IconButton>
  );
};

export default FavoriteButton;
