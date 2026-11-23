import type { ContactsSettings } from "../model/types";

export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const getOperatorRequisites = (contacts: ContactsSettings) => {
  const phone = contacts.operator_phone || contacts.phone;
  const email = contacts.operator_email || contacts.email;
  const registrationNumbers = [contacts.inn, contacts.ogrn].filter(Boolean).join(" / ");

  return [
    { label: "Наименование", value: contacts.operator_name },
    { label: "ИНН / ОГРН", value: registrationNumbers },
    { label: "Юридический адрес", value: contacts.legal_address },
    { label: "Электронная почта", value: email, href: `mailto:${email}` },
    { label: "Телефон", value: phone, href: phoneHref(phone) },
    { label: "Канал для юридических обращений", value: contacts.legal_contact },
  ].filter(({ value }) => value);
};
