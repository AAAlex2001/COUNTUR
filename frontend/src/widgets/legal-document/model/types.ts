import type { Requisite } from "@/shared/ui/requisites-card";

export type DocumentSection = {
  id: string;
  title: string;
  text: string;
  subtitle?: string;
  items?: string[];
  fields?: string[];
};

export type LegalDocument = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  revision: string;
  notice: { title: string; text: string };
  sections: DocumentSection[];
  statement?: { label: string; text: string; note: string };
  requisites: { title: string; items: Requisite[]; note: string };
  status: string;
};
