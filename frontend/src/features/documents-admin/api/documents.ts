import type { LegalDocument } from "@/entities/document";
import { adminRequest, jsonBody } from "@/shared/api";
import type { DocumentFields } from "../model/types";

/** Все документы магазина. */
export const fetchDocuments = () => adminRequest<LegalDocument[]>("/documents");

/** Документ для редактирования. */
export const fetchDocument = (slug: string) =>
  adminRequest<LegalDocument>(`/documents/${encodeURIComponent(slug)}`);

/** Сохранить новую редакцию документа. */
export const updateDocument = (slug: string, fields: DocumentFields) =>
  adminRequest<LegalDocument>(`/documents/${encodeURIComponent(slug)}`, jsonBody("PUT", fields));
