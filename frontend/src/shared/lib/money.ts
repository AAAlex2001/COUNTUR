/** Сумма в рублях в виде «42 990 ₽». */
export const formatRub = (value: string | number): string => {
  const amount = Number(value);

  if (Number.isNaN(amount)) return String(value);

  const digits = Number.isInteger(amount) ? 0 : 2;

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
};
