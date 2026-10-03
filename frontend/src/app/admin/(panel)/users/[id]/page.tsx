import { notFound } from "next/navigation";
import AdminUser from "@/widgets/admin/user";

/** Карточка покупателя. */
export default async function AdminUserRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) notFound();

  return <AdminUser userId={userId} />;
}
