import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type Order,
  type OrderStatus,
  type PaymentStatus,
} from "@/entities/order";
import Dropdown from "@/shared/ui/dropdown";
import type { OrderChanges } from "../../model/types";
import TrackingNumberField from "./tracking-number-field";
import styles from "./style.module.scss";

/** Подготовить варианты статусов. */
function statusOptions(labels: Record<string, string>) {
  return Object.entries(labels).map(([value, label]) => ({ value, label }));
}

const ORDER_OPTIONS = statusOptions(ORDER_STATUS_LABELS);
const PAYMENT_OPTIONS = statusOptions(PAYMENT_STATUS_LABELS);

type OrderControlsProps = {
  order: Order;
  pending: boolean;
  onSave: (changes: OrderChanges) => void;
};

/** Изменить статусы и трек-номер. */
export default function OrderControls({ order, pending, onSave }: OrderControlsProps) {
  return (
    <>
      <fieldset className={styles.controls} disabled={pending} aria-label="Статусы заказа">
        <div className={styles.control}>
          <span className={styles.controlLabel}>Статус заказа</span>
          <Dropdown
            className={styles.dropdown}
            value={order.status}
            options={ORDER_OPTIONS}
            onChange={(status) => onSave({ status: status as OrderStatus })}
          />
        </div>
        <div className={styles.control}>
          <span className={styles.controlLabel}>Оплата</span>
          <Dropdown
            className={styles.dropdown}
            value={order.payment_status}
            options={PAYMENT_OPTIONS}
            onChange={(status) => onSave({ payment_status: status as PaymentStatus })}
          />
        </div>
      </fieldset>

      {order.delivery_method !== "pickup" && order.status !== "canceled" && (
        <TrackingNumberField
          key={order.tracking_number}
          value={order.tracking_number ?? ""}
          pending={pending}
          onSave={(trackingNumber) => onSave({ tracking_number: trackingNumber })}
        />
      )}
    </>
  );
}
