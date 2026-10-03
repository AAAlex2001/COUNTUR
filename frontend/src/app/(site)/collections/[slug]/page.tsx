import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection } from "@/entities/collection";
import CollectionPage from "@/widgets/collection";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

/** Заголовок и описание страницы из данных подборки. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) return { title: "Подборка не найдена" };

  return { title: collection.title, description: collection.description ?? undefined };
}

/** Страница подборки. Если подборки нет или она выключена — 404. */
export default async function CollectionRoute({ params }: { params: Params }) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) notFound();

  return (
    <main>
      <CollectionPage collection={collection} />
    </main>
  );
}
