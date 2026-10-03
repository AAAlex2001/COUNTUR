"use client";

import cn from "classnames";
import Image from "next/image";
import { OrderStatusBadge, orderNumber, type Order } from "@/entities/order";
import { formatShortDate } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import { plural } from "@/shared/lib/text";
import Card from "@/shared/ui/card";
import Loader from "@/shared/ui/loader";
import { ORDERS_FILTERS, filterOrders } from "../../model/filters";
import type { OrdersFilter } from "../../model/types";
import styles from "./style.module.scss";

type OrdersHistoryProps = {
  orders: Order[];
  loaded: boolean;
  filter: OrdersFilter;
  onFilterChange: (filter: OrdersFilter) => void;
};

/** Карточка «История заказов»: фильтр по статусу и список заказов покупателя. */
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
            {visible.map((order) => {
              const [first] = order.items;
              const count = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <li className={styles.order} key={order.id}>
                  <div className={styles.meta}>
                    <span className={styles.number}>{orderNumber(order.id)}</span>
                    <span className={styles.date}>{formatShortDate(order.created_at)}</span>
                  </div>

                  <span className={styles.image}>
                    {first?.image_url && (
                      <Image
                        src={first.image_url}
                        alt=""
                        fill
                        sizes="56px"
                        unoptimized
                        className={styles.photo}
                      />
                    )}
                  </span>

                  <div className={styles.content}>
                    <span className={styles.name}>{first?.product_name}</span>
                    <span className={styles.details}>
                      {count} {plural(count, ["товар", "товара", "товаров"])}
                      {order.items.length > 1 && ` · ${order.items[1].product_name}`}
                    </span>
                  </div>

                  <span className={styles.sum}>{formatRub(order.total)}</span>

                  <OrderStatusBadge className={styles.status} status={order.status} />
                </li>
              );
            })}
          </ul>

          {visible.length === 0 && <p className={styles.empty}>Таких заказов нет.</p>}
        </>
      )}
    </Card>
  );
};

export default OrdersHistory;
