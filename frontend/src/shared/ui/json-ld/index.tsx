type JsonLdProps = {
  data: Record<string, unknown>;
};

/** Структурированные данные schema.org для поисковиков. Рендерится в <head> страницы. */
const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }}
  />
);

export default JsonLd;
