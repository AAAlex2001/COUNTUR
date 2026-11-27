import type { Metadata } from "next";
import { getCollections } from "@/entities/collection";
import Collections, { CollectionsHeading } from "@/widgets/collections";
import ProductCardActions from "@/widgets/product-card-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Готовые подборки",
  description: "Комплектующие, собранные в подборки под игры, работу и бюджет",
  alternates: { canonical: "/collections" },
};

/** Все включённые подборки, по блоку со слайдером на каждую. */
export default async function CollectionsRoute() {
  const collections = await getCollections();

  return (
    <main>
      <CollectionsHeading empty={collections.length === 0} />
      <Collections collections={collections} actions={ProductCardActions} />
    </main>
  );
}
