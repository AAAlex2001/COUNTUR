import type { Metadata } from "next";
import { getCollections } from "@/entities/collection";
import {
  getCatalogFilters,
  getCategories,
  getProducts,
  type SearchParams,
} from "@/entities/product";
import Catalog from "@/widgets/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог комплектующих",
  description: "Процессоры, видеокарты, материнские платы и другие комплектующие для сборки ПК",
};

/** Каталог. Фильтры по характеристикам бэкенд отдаёт только для одной выбранной категории. */
export default async function CatalogRoute({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
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
