"use client";

import { useUser } from "@/entities/user";
import { OrdersHistory, useOrders } from "@/features/orders-history";
import { AddressCard, ProfileForm, SettingsCard } from "@/features/profile";
import type { AccountSectionId } from "../../data";

type AccountSectionProps = {
  section: AccountSectionId;
};

/** Содержимое раздела кабинета. Без входа оболочка показывает приглашение, а раздел пуст. */
const AccountSection = ({ section }: AccountSectionProps) => {
  const { user } = useUser();
  const orders = useOrders();

  if (!user) return null;

  switch (section) {
    case "profile":
      return <ProfileForm user={user} />;

    case "orders":
      return (
        <OrdersHistory
          orders={orders.orders}
          loaded={orders.loaded}
          filter={orders.filter}
          onFilterChange={orders.changeFilter}
        />
      );

    case "address":
      return <AddressCard user={user} />;

    case "settings":
      return <SettingsCard user={user} />;
  }
};

export default AccountSection;
