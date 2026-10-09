/** Публичный адрес сайта без слэша на конце. Из него строятся canonical, sitemap и OG-ссылки. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "COUNTUR";

export const SITE_DESCRIPTION =
  "Интернет-магазин комплектующих для ПК: процессоры, видеокарты, материнские платы, память, накопители и готовые подборки для производительной сборки.";

export const SUPPORT_EMAIL = "support@countur.ru";

export const SUPPORT_PHONE = "8 800 555-01-90";

export const CONTACTS_PATH = "/contacts";

/** Реквизиты оператора. Поля в скобках заполняются перед публикацией. */
export const COMPANY_REQUISITES = [
  { label: "Наименование", value: "[Наименование оператора]" },
  { label: "ИНН / ОГРН", value: "[ИНН] / [ОГРН]" },
  { label: "Юридический адрес", value: "[Юридический адрес]" },
  { label: "Электронная почта", value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
  { label: "Телефон магазина", value: SUPPORT_PHONE },
];

export const COMPANY_REQUISITES_NOTE =
  "Контакты магазина взяты с текущих страниц. Канал для юридических обращений: [Контакт оператора].";

export const SITE_DOCUMENTS = [
  { label: "Политика конфиденциальности", href: "/privacy" },
  { label: "Обработка персональных данных", href: "/personal-data" },
];

/** Абсолютный адрес страницы или файла сайта. */
export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
