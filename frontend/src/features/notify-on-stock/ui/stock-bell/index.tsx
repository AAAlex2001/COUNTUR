"use client";

import IconButton from "@/shared/ui/icon-button";
import { BellIcon } from "@/shared/ui/icons";
import { useStockNotification } from "../../model/use-stock-notification";

type StockBellProps = { productId: number; productName: string };

/** Подписаться на поступление товара. */
export default function StockBell({ productId, productName }: StockBellProps) {
  const { subscribed, toggle, pending } = useStockNotification(productId);
  const label = subscribed ? "Отключить уведомление" : "Сообщить о поступлении";

  return (
    <IconButton
      ariaLabel={`${label}: ${productName}`}
      title={label}
      pressed={subscribed}
      tone="outline"
      loading={pending}
      onClick={toggle}
    >
      <BellIcon />
    </IconButton>
  );
}
