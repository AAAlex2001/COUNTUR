export type ContactFields = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
};

export type CheckoutState = {
  step: number;
  contacts: ContactFields;
  consent: boolean;
};

export type CheckoutAction =
  | { type: "contacts/change"; changes: Partial<ContactFields> }
  | { type: "consent/change"; value: boolean }
  | { type: "step/open"; step: number };
