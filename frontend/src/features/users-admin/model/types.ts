import type { OrderStatus, PaymentStatus } from "@/entities/order";
import type { User } from "@/entities/user";

export type AdminUserList = {
  users: User[];
  total: number;
};

/** Страница любого списка покупателя: заказов, избранного, корзины. */
export type Page<T> = {
  items: T[];
  total: number;
};

export type PageLoader<T> = (userId: number, limit: number, offset: number) => Promise<Page<T>>;

export type OrderChanges = {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
};

export type UsersListState = {
  search: string;
  query: string;
  page: number;
  list: AdminUserList | null;
  loading: boolean;
  failed: boolean;
};

export type UsersListAction =
  | { type: "search/change"; value: string }
  | { type: "load/start"; query: string; page: number }
  | { type: "load/success"; list: AdminUserList }
  | { type: "load/error" };

export type UserState = {
  user: User | null;
  failed: boolean;
};

export type UserAction = { type: "load/success"; user: User } | { type: "load/error" };

export type PagedState<T> = Page<T> & {
  page: number;
  loading: boolean;
  failed: boolean;
};

export type PagedAction<T> =
  | { type: "load/start"; page: number }
  | { type: "load/success"; page: Page<T> }
  | { type: "load/error" }
  | { type: "items/change"; items: T[] };
