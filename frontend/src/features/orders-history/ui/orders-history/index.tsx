"use client";

import cn from "classnames";
import type { Order } from "@/entities/order";
import { plural } from "@/shared/lib/text";
import Card from "@/shared/ui/card";
import Loader from "@/shared/ui/loader";
import { ORDERS_FILTERS, filterOrders } from "../../model/filters";
import type { OrdersFilter } from "../../model/types";
import { OrderHistoryRow } from "./order-history-row";
import styles from "./style.module.scss";

type OrdersHistoryProps = {
  orders: Order[];
  loaded: boolean;
  filter: OrdersFilter;
  onFilterChange: (filter: OrdersFilter) => void;
};

/** Показать историю заказов. */
const OrdersHistory = ({ orders, loaded, filter, onFilterChange }: OrdersHistoryProps) => {
  const visible = filterOrders(orders, filter);
  const total = orders.length;

  return (
    <Card
      id="orders"
      title="История заказов"
      action={
        total > 0 && (
          <span className={styles.total}>
            {total} {plural(total, ["заказ", "заказа", "заказов"])}
          </span>
        )
      }
    >
      {!loaded && <Loader size="lg" />}

      {loaded && total === 0 && (
        <p className={styles.empty}>Заказов пока нет — всё впереди.</p>
      )}

      {total > 0 && (
        <>
          <div className={styles.filters}>
            {ORDERS_FILTERS.map((option) => {
              const count = filterOrders(orders, option.value).length;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn(styles.filter, option.value === filter && styles.active)}
                  onClick={() => onFilterChange(option.value)}
                >
                  {option.label}
                  <span className={styles.count}>{count}</span>
                </button>
              );
            })}
          </div>

          <ul className={styles.list}>
            {visible.map((order) => <OrderHistoryRow key={order.id} order={order} />)}
          </ul>

          {visible.length === 0 && <p className={styles.empty}>Таких заказов нет.</p>}
        </>
      )}
    </Card>
  );
};

export default OrdersHistory;
