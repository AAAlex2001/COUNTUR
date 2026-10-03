"use client";

import { customerNumber, useUser, type User } from "@/entities/user";
import { LoginPrompt } from "@/features/auth";
import { OrdersHistory, useOrders } from "@/features/orders-history";
import { AddressCard, ProfileForm, SettingsCard } from "@/features/profile";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import Loader from "@/shared/ui/loader";
import Sidebar from "./ui/sidebar";
import styles from "./style.module.scss";

type AccountContentProps = {
  user: User;
};

/** Содержимое кабинета: колонка слева и карточки профиля, заказов, адреса и настроек. */
const AccountContent = ({ user }: AccountContentProps) => {
  const { state, changeFilter } = useOrders();

  return (
    <div className={styles.columns}>
      <Sidebar user={user} ordersCount={state.orders.length} />

      <div className={styles.content}>
        <ProfileForm user={user} />

        <OrdersHistory
          orders={state.orders}
          loaded={state.loaded}
          filter={state.filter}
          onFilterChange={changeFilter}
        />

        <div className={styles.pair}>
          <AddressCard user={user} />
          <SettingsCard user={user} />
        </div>
      </div>
    </div>
  );
};

/** Страница личного кабинета: шапка на месте сразу, содержимое — после проверки входа. */
const Account = () => {
  const { user, loaded } = useUser();

  return (
    <section className={styles.account}>
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Личный кабинет" }]} />

      <div className={styles.header}>
        <div className={styles.titles}>
          <p className={styles.eyebrow}>Личный кабинет</p>
          <h1 className={styles.title}>Профиль пользователя</h1>
        </div>

        {user && <p className={styles.customer}>ID: {customerNumber(user)}</p>}
      </div>

      <hr className={styles.divider} />

      {!loaded && <Loader size="lg" />}

      {loaded && !user && (
        <LoginPrompt
          title="Личный кабинет доступен после входа"
          text="Здесь будут ваши данные, адрес доставки и история заказов."
        />
      )}

      {user && <AccountContent user={user} />}
    </section>
  );
};

export default Account;
