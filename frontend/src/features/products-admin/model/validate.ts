import type {
  AdminCategory,
  AttributeErrors,
  AttributePayload,
  ProductErrors,
  ProductFields,
} from "./types";

const PRICE_PATTERN = /^\d+([.,]\d{1,2})?$/;
const COUNT_PATTERN = /^\d+$/;
const HIGHLIGHTS_LIMIT = 8;

/** Ошибки полей товара. Пустой объект — можно сохранять. */
export const validateProduct = (
  fields: ProductFields,
  category: AdminCategory | undefined,
): ProductErrors => {
  const errors: ProductErrors = {};
  const oldPrice = fields.oldPrice.trim();
  const stock = fields.stockQuantity.trim();
  const highlights = fields.highlights.split("\n").filter((line) => line.trim());

  if (fields.name.trim().length < 2) errors.name = "Укажите название";
  if (!category) errors.categoryId = "Выберите категорию";
  if (!PRICE_PATTERN.test(fields.price.trim())) errors.price = "Укажите цену числом, например 12990";
  if (oldPrice && !PRICE_PATTERN.test(oldPrice)) errors.oldPrice = "Цена числом или пусто";
  if (stock && !COUNT_PATTERN.test(stock)) errors.stockQuantity = "Целое число или пусто";

  if (highlights.length > HIGHLIGHTS_LIMIT) {
    errors.highlights = `Не больше ${HIGHLIGHTS_LIMIT} строк, сейчас ${highlights.length}`;
  }

  return errors;
};

/** Ошибки полей нового параметра категории. */
export const validateAttribute = (fields: AttributePayload): AttributeErrors => {
  const errors: AttributeErrors = {};

  if (!fields.group.trim()) errors.group = "Укажите группу";
  if (!fields.name.trim()) errors.name = "Укажите название";

  return errors;
};
