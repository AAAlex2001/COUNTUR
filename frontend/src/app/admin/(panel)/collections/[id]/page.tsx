import { notFound } from "next/navigation";
import CollectionEditor from "@/widgets/admin/collection-editor";

/** Редактирование подборки. */
export default async function AdminCollectionRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collectionId = Number(id);

  if (!Number.isInteger(collectionId) || collectionId <= 0) notFound();

  return <CollectionEditor collectionId={collectionId} />;
}
