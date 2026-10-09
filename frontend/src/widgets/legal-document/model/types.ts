export type DocumentSection = {
  id: string;
  title: string;
  text: string;
  subtitle?: string;
  items?: string[];
  fields?: string[];
};

export type DocumentRequisite = {
  label: string;
  value: string;
  href?: string;
};

export type LegalDocument = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  revision: string;
  notice: { title: string; text: string };
  sections: DocumentSection[];
  requisites: { title: string; items: DocumentRequisite[]; note: string };
  status: string;
};
