import type { Metadata } from "next";
import { documentPath, getDocument } from "@/entities/document";

/** Собрать метаданные документа. */
export async function documentMetadata(slug: string): Promise<Metadata> {
  const document = await getDocument(slug);

  if (!document) return { title: "Документ не найден", robots: { index: false } };

  return {
    title: document.title,
    description: document.description || undefined,
    alternates: { canonical: documentPath(slug) },
  };
}
