"use client";

import cn from "classnames";
import {
  ORDER_STATUS_LABELS,
  OrderStatusBadge,
  PAYMENT_STATUS_LABELS,
  orderNumber,
  type OrderStatus,
  type PaymentStatus,
} from "@/entities/order";
import { formatShortDate } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import { plural } from "@/shared/lib/text";
import Dropdown from "@/shared/ui/dropdown";
import { useUserOrders } from "../../model/use-user-orders";
import PagedPanel from "../paged-panel";
import ProductRow from "../product-row";
import styles from "./style.module.scss";

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const STATUS_OPTIONS = toOptions(ORDER_STATUS_LABELS);
const PAYMENT_OPTIONS = toOptions(PAYMENT_STATUS_LABELS);

type UserOrdersProps = {
  userId: number;
};

/** Заказы покупателя: состав каждого, сумма и выпадающие списки статусов заказа и оплаты. */
const UserOrders = ({ userId }: UserOrdersProps) => {
  const { state, pages, openPage, pendingId, change } = useUserOrders(userId);

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
        const count = order.items.reduce((sum, item) => sum + item.quantity, 0);

        return (
          <li className={cn(styles.order, order.id === pendingId && styles.pending)} key={order.id}>
            <div className={styles.header}>
              <div className={styles.meta}>
                <span className={styles.number}>{orderNumber(order.id)}</span>
                <span className={styles.date}>
                  {formatShortDate(order.created_at)} · {count}{" "}
                  {plural(count, ["товар", "товара", "товаров"])}
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

            <div className={styles.controls}>
              <div className={styles.control}>
                <span className={styles.controlLabel}>Статус заказа</span>
                <Dropdown
                  className={styles.dropdown}
                  value={order.status}
                  options={STATUS_OPTIONS}
                  onChange={(status) => change(order, { status: status as OrderStatus })}
                />
              </div>

              <div className={styles.control}>
                <span className={styles.controlLabel}>Оплата</span>
                <Dropdown
                  className={styles.dropdown}
                  value={order.payment_status}
                  options={PAYMENT_OPTIONS}
                  onChange={(payment) => change(order, { payment_status: payment as PaymentStatus })}
                />
              </div>
            </div>
          </li>
        );
      })}
    </PagedPanel>
  );
};

export default UserOrders;
