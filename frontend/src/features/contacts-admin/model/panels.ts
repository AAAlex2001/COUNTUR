import type { ContactsPanel } from "./types";

export const CONTACT_PANELS: ContactsPanel[] = [
  {
    title: "Заголовок страницы",
    fields: [
      { name: "eyebrow", label: "Надзаголовок", maxLength: 100 },
      { name: "title", label: "Заголовок", maxLength: 150 },
      { name: "description", label: "Описание страницы", maxLength: 500, type: "textarea" },
    ],
  },
  {
    title: "Телефон и почта магазина",
    fields: [
      { name: "phone", label: "Телефон", maxLength: 40, type: "tel" },
      { name: "phone_label", label: "Заголовок карточки телефона", maxLength: 100 },
      { name: "phone_description", label: "Описание для телефона", maxLength: 300 },
      { name: "email", label: "Почта", maxLength: 254, type: "email" },
      { name: "email_label", label: "Заголовок карточки почты", maxLength: 100 },
      { name: "email_description", label: "Описание для почты", maxLength: 300 },
    ],
  },
  {
    title: "Расположение магазина",
    toggles: [
      { name: "show_location", label: "Показывать расположение магазина" },
      { name: "show_map", label: "Показывать ссылку на карту" },
    ],
    fields: [
      { name: "location_title", label: "Заголовок блока расположения", maxLength: 150 },
      { name: "store_address", label: "Адрес магазина или пункта выдачи", maxLength: 300 },
      { name: "hours", label: "Режим работы", maxLength: 200 },
      { name: "directions", label: "Как добраться", maxLength: 500, type: "textarea" },
      {
        name: "map_url",
        label: "Ссылка на карту",
        maxLength: 2083,
        hint: "Начинается с https:// или http://",
      },
    ],
  },
  {
    title: "Форма обращения и документы",
    toggles: [
      { name: "show_feedback", label: "Показывать форму обращения" },
      { name: "show_documents", label: "Показывать ссылки на документы" },
    ],
    fields: [
      { name: "feedback_title", label: "Заголовок формы", maxLength: 150 },
      { name: "feedback_description", label: "Описание формы", maxLength: 500, type: "textarea" },
      { name: "documents_title", label: "Заголовок блока документов", maxLength: 150 },
    ],
  },
  {
    title: "Реквизиты и контакты оператора",
    toggles: [
      { name: "show_requisites", label: "Показывать реквизиты на странице контактов" },
    ],
    fields: [
      { name: "company_title", label: "Заголовок реквизитов на странице контактов", maxLength: 150 },
      { name: "operator_title", label: "Заголовок карточки оператора в документах", maxLength: 150 },
      { name: "operator_name", label: "Наименование оператора", maxLength: 200 },
      { name: "inn", label: "ИНН", maxLength: 12 },
      { name: "ogrn", label: "ОГРН / ОГРНИП", maxLength: 15 },
      { name: "legal_address", label: "Юридический адрес", maxLength: 300 },
      {
        name: "operator_email",
        label: "Почта оператора",
        maxLength: 254,
        type: "email",
        hint: "По умолчанию используется почта магазина",
      },
      {
        name: "operator_phone",
        label: "Телефон оператора",
        maxLength: 40,
        type: "tel",
        hint: "По умолчанию используется телефон магазина",
      },
      { name: "legal_contact", label: "Канал для юридических обращений", maxLength: 300 },
      { name: "operator_note", label: "Примечание", maxLength: 500, type: "textarea" },
    ],
  },
];
