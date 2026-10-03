"use client";

import { customerNumber, fullName } from "@/entities/user";
import {
  UserCart,
  UserFavorites,
  UserOrders,
  UserSummary,
  useAdminUser,
} from "@/features/users-admin";
import BackButton from "@/shared/ui/back-button";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

type AdminUserProps = {
  userId: number;
};

/** Карточка покупателя в админке: профиль, заказы со статусами, избранное и корзина. */
const AdminUser = ({ userId }: AdminUserProps) => {
  const { user, failed } = useAdminUser(userId);

  if (failed) {
    return <p className={styles.error}>Покупатель не найден.</p>;
  }

  if (!user) {
    return <Loader size="lg" />;
  }

  return (
    <section className={styles.user}>
      <BackButton className={styles.back} />

      <div className={styles.header}>
        <h1 className={styles.title}>{fullName(user)}</h1>
        <span className={styles.number}>{customerNumber(user)}</span>
      </div>

      <UserSummary user={user} />
      <UserOrders userId={user.id} />
      <UserFavorites userId={user.id} />
      <UserCart userId={user.id} />
    </section>
  );
};

export default AdminUser;
