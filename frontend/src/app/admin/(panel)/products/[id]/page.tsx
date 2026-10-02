import { notFound } from "next/navigation";
import ProductEditor from "@/widgets/admin/product-editor";

/** Редактирование товара. */
export default async function AdminProductRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) notFound();

  return <ProductEditor productId={productId} />;
}
