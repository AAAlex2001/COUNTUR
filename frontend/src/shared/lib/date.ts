const TIME_ZONE = "Europe/Moscow";

const DATE_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const SHORT_DATE_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const MONTH_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const format = (formatter: Intl.DateTimeFormat, value: string): string => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : formatter.format(date);
};

/** Дата в виде «2 октября 2026 г.». */
export const formatDate = (value: string) => format(DATE_FORMAT, value);

/** Дата в виде «02.10.2026». */
export const formatShortDate = (value: string) => format(SHORT_DATE_FORMAT, value);

/** Месяц и год в виде «октябрь 2026 г.». */
export const formatMonth = (value: string) => format(MONTH_FORMAT, value);
