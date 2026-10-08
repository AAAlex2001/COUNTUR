import type { Metadata } from "next";
import { getCollections } from "@/entities/collection";
import {
  CATALOG_PATH,
  categoryPath,
  getCatalogFilters,
  getCategories,
  getProducts,
  type SearchParams,
} from "@/entities/product";
import Catalog from "@/widgets/catalog";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<SearchParams>;
};

/** Заголовок по категории; страницы с фильтрами, поиском и листанием не индексируются. */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const categorySlug = typeof params.category === "string" ? params.category : null;
  const filtered = Object.keys(params).some((name) => name !== "category");

  const category = categorySlug
    ? (await getCategories()).find((item) => item.slug === categorySlug)
    : undefined;

  return {
    title: category ? category.name : "Каталог комплектующих",
    description: category
      ? `${category.name} в COUNTUR: цены, характеристики, наличие. Подбор комплектующих для сборки ПК.`
      : "Процессоры, видеокарты, материнские платы и другие комплектующие для сборки ПК",
    alternates: { canonical: category ? categoryPath(category.slug) : CATALOG_PATH },
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

/** Каталог. Фильтры по характеристикам бэкенд отдаёт только для одной выбранной категории. */
export default async function CatalogRoute({ searchParams }: Props) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : null;

  const [list, categories, filters, collections] = await Promise.all([
    getProducts(params),
    getCategories(),
    getCatalogFilters(category),
    getCollections("catalog"),
  ]);

  return (
    <main>
      <Catalog
        list={list}
        categories={categories}
        filters={filters}
        collections={collections}
        view={params.view === "list" ? "list" : "grid"}
        search={typeof params.q === "string" ? params.q : ""}
      />
    </main>
  );
}
