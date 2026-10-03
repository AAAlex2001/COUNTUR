import type { User } from "../model/types";

export const ACCOUNT_PATH = "/account";

/** Номер клиента вида CT-000241. */
export const customerNumber = (user: User) => `CT-${String(user.id).padStart(6, "0")}`;

/** Имя и фамилия через пробел. */
export const fullName = (user: User) => [user.name, user.last_name].filter(Boolean).join(" ");

/** Инициалы для аватара: первые буквы имени и фамилии. */
export const initials = (user: User) =>
  [user.name, user.last_name]
    .filter(Boolean)
    .map((part) => part?.[0]?.toUpperCase())
    .join("");
