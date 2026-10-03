import { cookies } from "next/headers";
import { load } from "@/shared/api/server";
import type { User } from "../model/types";

const USER_COOKIE = "user_token";

/** Заголовки с cookie входа для запросов к бэкенду с сервера. Без cookie — null. */
export const sessionHeaders = async (): Promise<HeadersInit | null> => {
  const token = (await cookies()).get(USER_COOKIE)?.value;

  return token ? { Cookie: `${USER_COOKIE}=${token}` } : null;
};

/** Покупатель по cookie входа. Просроченный или чужой токен — null. */
export const getSessionUser = (headers: HeadersInit) => load<User | null>("/v1/auth/me", null, headers);
