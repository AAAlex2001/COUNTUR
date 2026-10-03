import cn from "classnames";
import { ORDER_STATUS_LABELS } from "../../lib/status";
import type { OrderStatus } from "../../model/types";
import styles from "./style.module.scss";

type OrderStatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

/** Плашка статуса заказа. У каждого статуса свой цвет. */
const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => (
  <span className={cn(styles.badge, styles[status], className)}>
    {ORDER_STATUS_LABELS[status]}
  </span>
);

export default OrderStatusBadge;
