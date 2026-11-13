import type { CollectionErrors, CollectionFields } from "./types";

/** Ошибки полей подборки. Пустой объект — можно сохранять. */
export const validateCollection = (fields: CollectionFields): CollectionErrors => {
  const errors: CollectionErrors = {};

  if (fields.title.trim().length < 2) errors.title = "Укажите название, хотя бы 2 символа";

  return errors;
};
