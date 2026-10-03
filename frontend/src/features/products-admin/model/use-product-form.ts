"use client";

import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { adminProductPath } from "@/shared/lib/admin-paths";
import { swap } from "@/shared/lib/array";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { createProduct, updateProduct, uploadProductImage } from "../api/products";
import { formReducer } from "./reducers";
import type { AdminCategory, AdminProduct, ProductFields, ProductPayload } from "./types";

/** Поля формы из товара. Для нового товара — пустые, с первой категорией. */
const toFields = (product: AdminProduct | null, categories: AdminCategory[]): ProductFields => ({
  name: product?.name ?? "",
  sku: product?.sku ?? "",
  categoryId: String(product?.category_id ?? categories[0]?.id ?? ""),
  brandId: String(product?.brand_id ?? ""),
  shortDescription: product?.short_description ?? "",
  description: product?.description ?? "",
  highlights: product?.highlights.join("\n") ?? "",
  price: product?.price ?? "",
  oldPrice: product?.old_price ?? "",
  stockQuantity: String(product?.stock_quantity ?? ""),
  availability: product?.availability ?? "in_stock",
  isHit: product?.is_hit ?? false,
  sortOrder: String(product?.sort_order ?? 0),
  specs: Object.fromEntries(product?.specs.map((spec) => [spec.attribute_id, spec.value]) ?? []),
});

/** Тело запроса из полей формы. Пустые необязательные поля уходят как null. */
const toPayload = (fields: ProductFields, category: AdminCategory): ProductPayload => ({
  name: fields.name.trim(),
  sku: fields.sku.trim() || null,
  category_id: category.id,
  brand_id: fields.brandId ? Number(fields.brandId) : null,
  short_description: fields.shortDescription.trim() || null,
  description: fields.description.trim() || null,
  highlights: fields.highlights
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean),
  price: fields.price.trim().replace(",", "."),
  old_price: fields.oldPrice.trim().replace(",", ".") || null,
  stock_quantity: fields.stockQuantity.trim() ? Number(fields.stockQuantity) : null,
  availability: fields.availability,
  is_hit: fields.isHit,
  sort_order: Number(fields.sortOrder) || 0,
  specs: category.attributes
    .map((attribute) => ({
      attribute_id: attribute.id,
      value: fields.specs[attribute.id]?.trim() ?? "",
    }))
    .filter((spec) => spec.value !== ""),
});

/** Форма товара: поля, фото нового товара и сохранение. */
export const useProductForm = (
  product: AdminProduct | null,
  categories: AdminCategory[],
  onSaved: (product: AdminProduct) => void,
) => {
  const router = useRouter();
  const toast = useToast();
  const [state, dispatch] = useReducer(formReducer, {
    fields: toFields(product, categories),
    drafts: [],
    pending: false,
  });
  const { fields, drafts } = state;

  const category = categories.find((item) => String(item.id) === fields.categoryId);

  const change = (changes: Partial<ProductFields>) => dispatch({ type: "fields/change", changes });

  const addDrafts = (files: File[]) => {
    const added = files.map((file) => {
      const url = URL.createObjectURL(file);

      return { id: url, url, file };
    });

    dispatch({ type: "drafts/change", drafts: [...drafts, ...added] });
  };

  const moveDraft = (index: number, shift: number) =>
    dispatch({ type: "drafts/change", drafts: swap(drafts, index, shift) });

  const removeDraft = (index: number) =>
    dispatch({ type: "drafts/change", drafts: drafts.filter((draft) => draft !== drafts[index]) });

  /** Сохранить товар. Новый товар создаётся, получает выбранные фото и открывается. */
  const save = async () => {
    if (!category) return;

    dispatch({ type: "save/start" });

    try {
      const payload = toPayload(fields, category);

      if (product) {
        onSaved(await updateProduct(product.id, payload));
        toast("Товар сохранён");
      } else {
        const created = await createProduct(payload);

        toast("Товар создан");

        for (const draft of drafts) {
          await uploadProductImage(created.id, draft.file).catch(() =>
            toast("Не все фото загрузились, добавьте их ещё раз", "error"),
          );
        }

        router.replace(adminProductPath(created.id));
      }
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить товар"), "error");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { state, category, change, addDrafts, moveDraft, removeDraft, save };
};
