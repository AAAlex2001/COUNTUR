import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collectionPath, getCollection } from "@/entities/collection";
import { absoluteUrl } from "@/shared/config/site";
import CollectionPage from "@/widgets/collection";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

/** Заголовок и описание страницы из данных подборки. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) return { title: "Подборка не найдена", robots: { index: false } };

  const description =
    collection.description ?? `Подборка «${collection.title}»: комплектующие, которые хорошо работают вместе.`;
  const cover = collection.products.find((product) => product.image_url)?.image_url;

  return {
    title: collection.title,
    description,
    alternates: { canonical: collectionPath(collection.slug) },
    openGraph: {
      title: collection.title,
      description,
      url: collectionPath(collection.slug),
      images: cover ? [{ url: absoluteUrl(cover), alt: collection.title }] : [],
    },
  };
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
