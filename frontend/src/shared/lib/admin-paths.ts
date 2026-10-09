export const ADMIN_LOGIN_PATH = "/admin/login";

export const ADMIN_PRODUCTS_PATH = "/admin/products";

export const ADMIN_NEW_PRODUCT_PATH = "/admin/products/new";

export const ADMIN_LANDING_PATH = "/admin/landing";

export const ADMIN_USERS_PATH = "/admin/users";

export const ADMIN_FEEDBACK_PATH = "/admin/feedback";

/** Адрес карточки обращения. */
export const adminFeedbackPath = (id: number) => `${ADMIN_FEEDBACK_PATH}/${id}`;

export const ADMIN_COLLECTIONS_PATH = "/admin/collections";

export const ADMIN_NEW_COLLECTION_PATH = "/admin/collections/new";

/** Адрес страницы редактирования подборки. */
export const adminCollectionPath = (id: number) => `${ADMIN_COLLECTIONS_PATH}/${id}`;

/** Адрес страницы редактирования товара. */
export const adminProductPath = (id: number) => `${ADMIN_PRODUCTS_PATH}/${id}`;

/** Адрес карточки покупателя. */
export const adminUserPath = (id: number) => `${ADMIN_USERS_PATH}/${id}`;
