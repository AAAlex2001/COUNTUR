export const ADMIN_LOGIN_PATH = "/admin/login";

export const ADMIN_PRODUCTS_PATH = "/admin/products";

export const ADMIN_NEW_PRODUCT_PATH = "/admin/products/new";

export const ADMIN_LANDING_PATH = "/admin/landing";

export const ADMIN_USERS_PATH = "/admin/users";

/** Адрес страницы редактирования товара. */
export const adminProductPath = (id: number) => `${ADMIN_PRODUCTS_PATH}/${id}`;

/** Адрес карточки покупателя. */
export const adminUserPath = (id: number) => `${ADMIN_USERS_PATH}/${id}`;
