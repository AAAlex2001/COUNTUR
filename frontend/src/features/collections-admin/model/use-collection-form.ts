"use client";

import { useRouter } from "next/navigation";
import { useReducer } from "react";
import type { ProductCardData } from "@/entities/product";
import { adminCollectionPath } from "@/shared/lib/admin-paths";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { createCollection, updateCollection } from "../api/collections";
import { formReducer } from "./reducers";
import type { AdminCollection, CollectionFields, CollectionPayload } from "./types";

/** Поля формы из подборки. Для новой — пустые с показом на главной. */
const toFields = (collection: AdminCollection | null): CollectionFields => ({
  title: collection?.title ?? "",
  description: collection?.description ?? "",
  showOnHome: collection?.show_on_home ?? true,
  showInCatalog: collection?.show_in_catalog ?? false,
  isActive: collection?.is_active ?? true,
  sortOrder: String(collection?.sort_order ?? 0),
  products: collection?.products ?? [],
});

/** Данные для API из полей формы. */
const toPayload = (fields: CollectionFields): CollectionPayload => ({
  title: fields.title.trim(),
  description: fields.description.trim() || null,
  show_on_home: fields.showOnHome,
  show_in_catalog: fields.showInCatalog,
  is_active: fields.isActive,
  sort_order: Number(fields.sortOrder) || 0,
  product_ids: fields.products.map((product) => product.id),
});

/** Форма подборки: поля, состав и сохранение. */
export const useCollectionForm = (
  collection: AdminCollection | null,
  onSaved: (collection: AdminCollection) => void,
) => {
  const router = useRouter();
  const toast = useToast();
  const [state, dispatch] = useReducer(formReducer, {
    fields: toFields(collection),
    pending: false,
  });
  const { fields } = state;

  const change = (changes: Partial<CollectionFields>) =>
    dispatch({ type: "fields/change", changes });

  const addProduct = (product: ProductCardData) => {
    if (fields.products.some((item) => item.id === product.id)) return;

    change({ products: [...fields.products, product] });
  };

  const removeProduct = (productId: number) =>
    change({ products: fields.products.filter((product) => product.id !== productId) });

  /** Сохранить подборку. Новая создаётся и открывается на редактирование. */
  const save = async () => {
    dispatch({ type: "save/start" });

    try {
      if (collection) {
        onSaved(await updateCollection(collection.id, toPayload(fields)));
        toast("Подборка сохранена");
      } else {
        const created = await createCollection(toPayload(fields));

        toast("Подборка создана");
        router.replace(adminCollectionPath(created.id));
      }
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить подборку"), "error");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { state, change, addProduct, removeProduct, save };
};
