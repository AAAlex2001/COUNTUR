/** Текст пойманной ошибки или запасной текст, если это не Error. */
export const errorMessage = (failure: unknown, fallback: string): string =>
  failure instanceof Error ? failure.message : fallback;

/** Тост, когда форма не отправлена из-за незаполненных полей. */
export const INVALID_FORM_MESSAGE = "Заполните поля, отмеченные красным";
