export const ADMIN_LOGIN_PATH = "/admin/login";

export const ADMIN_PRODUCTS_PATH = "/admin/products";

export const ADMIN_NEW_PRODUCT_PATH = "/admin/products/new";

/** Адрес страницы редактирования товара. */
export const adminProductPath = (id: number) => `${ADMIN_PRODUCTS_PATH}/${id}`;
