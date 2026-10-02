/**
 * Две строки характеристик для карточки в каталоге.
 * Если характеристик больше двух, первые две склеиваются в одну строку.
 */
export const cardSpecLines = (highlights: string[]): string[] => {
  if (highlights.length <= 2) return highlights;

  const [first, second] = highlights;
  const last = highlights[highlights.length - 1];

  return [`${first} · ${second}`, last];
};
