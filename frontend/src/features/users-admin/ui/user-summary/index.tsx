import { customerNumber, type User } from "@/entities/user";
import { formatDate } from "@/shared/lib/date";
import Panel from "@/shared/ui/panel";
import styles from "./style.module.scss";

type UserSummaryProps = {
  user: User;
};

/** Какие уведомления покупатель согласился получать. */
const notifications = (user: User) =>
  [user.notify_orders && "о заказах", user.notify_promo && "об акциях"].filter(Boolean).join(", ") ||
  "выключены";

/** Профиль покупателя: контакты, адрес, дата регистрации и настройки уведомлений. */
const UserSummary = ({ user }: UserSummaryProps) => {
  const rows = [
    ["ID", `${user.id} · ${customerNumber(user)}`],
    ["Email", user.email],
    ["Телефон", user.phone ?? "—"],
    ["Адрес доставки", user.address ?? "—"],
    ["Регистрация", formatDate(user.created_at)],
    ["Уведомления", notifications(user)],
  ];

  return (
    <Panel title="Профиль">
      <dl className={styles.list}>
        {rows.map(([label, value]) => (
          <div className={styles.row} key={label}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
};

export default UserSummary;
