import Link from "next/link";
import { customerNumber, fullName, initials, type User } from "@/entities/user";
import { adminUserPath } from "@/shared/lib/admin-paths";
import { formatShortDate } from "@/shared/lib/date";
import styles from "./style.module.scss";

type UsersTableProps = {
  users: User[];
};

/** Список покупателей админки. Строка целиком ведёт в карточку покупателя. */
const UsersTable = ({ users }: UsersTableProps) => (
  <ul className={styles.table}>
    {users.map((user) => (
      <li key={user.id}>
        <Link className={styles.row} href={adminUserPath(user.id)}>
          <span className={styles.avatar}>{initials(user)}</span>

          <span className={styles.info}>
            <span className={styles.name}>{fullName(user)}</span>
            <span className={styles.meta}>{user.email}</span>
          </span>

          <span className={styles.contacts}>
            <span className={styles.number}>{customerNumber(user)}</span>
            <span className={styles.meta}>{user.phone ?? "Телефон не указан"}</span>
          </span>

          <span className={styles.date}>{formatShortDate(user.created_at)}</span>
        </Link>
      </li>
    ))}
  </ul>
);

export default UsersTable;
