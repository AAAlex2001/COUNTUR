"use client";

import { useState } from "react";
import { addFavorite, removeFavorite, useFavorites } from "@/entities/favorite";
import IconButton from "@/shared/ui/icon-button";
import { HeartIcon } from "@/shared/ui/icons";

type FavoriteButtonProps = {
  productId: number;
  size?: "lg" | "md";
  className?: string;
};

/** Кнопка-сердечко: добавляет товар в избранное или убирает из него. */
const FavoriteButton = ({ productId, size = "lg", className }: FavoriteButtonProps) => {
  const { ids, setIds } = useFavorites();
  const [pending, setPending] = useState(false);
  const active = ids.includes(productId);

  const toggle = async () => {
    setPending(true);

    try {
      if (active) {
        await removeFavorite(productId);
        setIds(ids.filter((id) => id !== productId));
      } else {
        await addFavorite(productId);
        setIds([...ids, productId]);
      }
    } catch {
      return;
    } finally {
      setPending(false);
    }
  };

  return (
    <IconButton
      className={className}
      tone="outline"
      size={size}
      pressed={active}
      ariaLabel={active ? "Убрать из избранного" : "Добавить в избранное"}
      disabled={pending}
      onClick={toggle}
    >
      <HeartIcon />
    </IconButton>
  );
};

export default FavoriteButton;
