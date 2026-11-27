/** Публичный адрес сайта без слэша на конце. Из него строятся canonical, sitemap и OG-ссылки. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "COUNTUR";

export const SITE_DESCRIPTION =
  "Интернет-магазин комплектующих для ПК: процессоры, видеокарты, материнские платы, память, накопители и готовые подборки для производительной сборки.";

export const ABOUT_PATH = "/about";

export const DELIVERY_PATH = "/delivery";

export const RETURNS_URL =
  "https://my.cdek.ru/lkfl/clients-return/9843fc42-fdf7-4298-9390-5a8f15d3a75e";

export const CONTACTS_PATH = "/contacts";

export const PRIVACY_PATH = "/privacy";

export const PRIVACY_APPENDIX = {
  href: "/privacy-appendix-1",
  label: "Приложение № 1 к политике конфиденциальности",
};

export const PERSONAL_DATA_PATH = "/personal-data";

export const TERMS_PATH = "/terms";

export const OFFER_PATH = "/offer";

export const SITE_DOCUMENTS = [
  { label: "Политика конфиденциальности", href: PRIVACY_PATH },
  PRIVACY_APPENDIX,
  { label: "Обработка персональных данных", href: PERSONAL_DATA_PATH },
  { label: "Пользовательское соглашение", href: TERMS_PATH },
  { label: "Договор оферты", href: OFFER_PATH },
];

/** Абсолютный адрес страницы или файла сайта. */
export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
