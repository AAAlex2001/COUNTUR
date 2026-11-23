export type ContactTextFields = {
  eyebrow: string;
  title: string;
  description: string;

  phone: string;
  phone_label: string;
  phone_description: string;
  email: string;
  email_label: string;
  email_description: string;

  location_title: string;
  store_address: string;
  hours: string;
  directions: string;
  map_url: string;

  feedback_title: string;
  feedback_description: string;
  documents_title: string;

  company_title: string;
  operator_title: string;
  operator_name: string;
  inn: string;
  ogrn: string;
  legal_address: string;
  operator_email: string;
  operator_phone: string;
  legal_contact: string;
  operator_note: string;
};

export type ContactVisibility = {
  show_location: boolean;
  show_map: boolean;
  show_feedback: boolean;
  show_documents: boolean;
  show_requisites: boolean;
};

export type ContactsSettings = ContactTextFields & ContactVisibility;
