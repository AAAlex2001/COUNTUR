import type { MetadataRoute } from "next";
import { COLLECTIONS_PATH, collectionPath, getCollections } from "@/entities/collection";
import {
  CATALOG_PATH,
  categoryPath,
  getCategories,
  getProductsSitemap,
  productPath,
} from "@/entities/product";
import { absoluteUrl } from "@/shared/config/site";

export const dynamic = "force-dynamic";

/** Карта сайта: главная, каталог с категориями, товары и подборки. Закрытые разделы не попадают. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections] = await Promise.all([
    getProductsSitemap(),
    getCategories(),
    getCollections(),
  ]);

  return [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl(CATALOG_PATH), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl(COLLECTIONS_PATH), changeFrequency: "weekly", priority: 0.7 },
    ...categories.map((category) => ({
      url: absoluteUrl(categoryPath(category.slug)),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...collections.map((collection) => ({
      url: absoluteUrl(collectionPath(collection.slug)),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(productPath(product.slug)),
      lastModified: product.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
