import Image from "next/image";
import { OrderStatusBadge, orderItemCount, orderNumber, type Order } from "@/entities/order";
import { formatShortDate } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import { plural } from "@/shared/lib/text";
import styles from "./style.module.scss";

/** Показать заказ в истории. */
export function OrderHistoryRow({ order }: { order: Order }) {
  const [first, second] = order.items;
  const count = orderItemCount(order);

  return (
    <li className={styles.order}>
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
        {order.tracking_number && (
          <span className={styles.details}>Трек-номер: {order.tracking_number}</span>
        )}
        <span className={styles.details}>
          {count} {plural(count, ["товар", "товара", "товаров"])}
          {second && ` · ${second.product_name}`}
        </span>
      </div>

      <span className={styles.sum}>{formatRub(order.total)}</span>

      <OrderStatusBadge className={styles.status} status={order.status} />
    </li>
  );
}
