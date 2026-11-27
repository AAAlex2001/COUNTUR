import type { ContactsSettings, ContactTextFields, ContactVisibility } from "@/entities/contacts";

type ContactField = {
  name: keyof ContactTextFields;
  label: string;
  maxLength: number;
  type?: "email" | "tel" | "textarea";
  hint?: string;
};

type ContactToggle = {
  name: keyof ContactVisibility;
  label: string;
};

export type ContactsPanel = {
  title: string;
  fields: ContactField[];
  toggles?: ContactToggle[];
};

export type ChangeContact = <Key extends keyof ContactsSettings>(
  name: Key,
  value: ContactsSettings[Key],
) => void;
