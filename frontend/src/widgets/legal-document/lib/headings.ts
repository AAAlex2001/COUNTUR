export type Heading = {
  id: string;
  title: string;
};

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

/** Текст заголовка без тегов и HTML-сущностей — для оглавления. */
const toText = (html: string) =>
  html.replace(/<[^>]+>/g, "").replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (entity) => ENTITIES[entity]);

/**
 * Проставить разделам якоря и собрать оглавление.
 * Заголовки разделов — h2 без атрибутов: именно так их сохраняет бэкенд после очистки.
 */
export const withHeadings = (html: string) => {
  const headings: Heading[] = [];

  const content = html.replace(/<h2>(.*?)<\/h2>/g, (_, inner: string) => {
    const id = `section-${headings.length + 1}`;

    headings.push({ id, title: toText(inner) });

    return `<h2 id="${id}">${inner}</h2>`;
  });

  return { content, headings };
};
