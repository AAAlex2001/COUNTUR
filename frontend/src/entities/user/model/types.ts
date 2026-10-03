export type User = {
  id: number;
  name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  notify_orders: boolean;
  notify_promo: boolean;
  created_at: string;
};

export type UserChanges = Partial<
  Pick<User, "name" | "last_name" | "email" | "phone" | "address" | "notify_orders" | "notify_promo">
>;
