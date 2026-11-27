"use client";

import cn from "classnames";
import { OrderStatusBadge, orderNumber, orderItemCount } from "@/entities/order";
import { formatShortDate } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import { plural } from "@/shared/lib/text";
import { useUserOrders } from "../../model/use-user-orders";
import PagedPanel from "../paged-panel";
import ProductRow from "../product-row";
import OrderControls from "./order-controls";
import styles from "./style.module.scss";

type UserOrdersProps = { userId: number };

/** Показать заказы покупателя. */
export default function UserOrders({ userId }: UserOrdersProps) {
  const { state, pages, openPage, savingIds, save } = useUserOrders(userId);

  return (
    <PagedPanel
      title="Заказы"
      unit={["заказ", "заказа", "заказов"]}
      empty="Покупатель ещё ничего не заказывал."
      state={state}
      pages={pages}
      onPage={openPage}
    >
      {state.items.map((order) => {
        const count = orderItemCount(order);
        const pending = savingIds.includes(order.id);

        return (
          <li className={cn(styles.order, pending && styles.pending)} key={order.id}>
            <div className={styles.header}>
              <div className={styles.meta}>
                <span className={styles.number}>{orderNumber(order.id)}</span>
                <span className={styles.date}>
                  {formatShortDate(order.created_at)} · {count} {plural(count, ["товар", "товара", "товаров"])}
                </span>
              </div>
              <OrderStatusBadge status={order.status} />
              <span className={styles.sum}>{formatRub(order.total)}</span>
            </div>

            <ul className={styles.items}>
              {order.items.map((item, index) => (
                <ProductRow
                  key={index}
                  image={item.image_url}
                  name={item.product_name}
                  meta={`${item.quantity} × ${formatRub(item.price)}`}
                  price={item.subtotal}
                />
              ))}
            </ul>

            <OrderControls order={order} pending={pending} onSave={(changes) => save(order.id, changes)} />
          </li>
        );
      })}
    </PagedPanel>
  );
}
