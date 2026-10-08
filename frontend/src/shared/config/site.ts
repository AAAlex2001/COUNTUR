/** Публичный адрес сайта без слэша на конце. Из него строятся canonical, sitemap и OG-ссылки. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "COUNTUR";

export const SITE_DESCRIPTION =
  "Интернет-магазин комплектующих для ПК: процессоры, видеокарты, материнские платы, память, накопители и готовые подборки для производительной сборки.";

/** Абсолютный адрес страницы или файла сайта. */
export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
