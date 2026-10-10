import DocumentEditor from "@/widgets/admin/document-editor";

/** Редактирование документа магазина. */
export default async function AdminDocumentRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <DocumentEditor slug={slug} />;
}
