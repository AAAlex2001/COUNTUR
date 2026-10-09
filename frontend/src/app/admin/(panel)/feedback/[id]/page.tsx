import { notFound } from "next/navigation";
import AdminFeedbackMessage from "@/widgets/admin/feedback-message";

/** Карточка обращения с ответом. */
export default async function AdminFeedbackMessageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const messageId = Number(id);

  if (!Number.isInteger(messageId) || messageId <= 0) notFound();

  return <AdminFeedbackMessage messageId={messageId} />;
}
