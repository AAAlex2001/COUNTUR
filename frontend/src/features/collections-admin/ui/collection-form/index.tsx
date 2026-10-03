"use client";

import Button from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import Textarea from "@/shared/ui/textarea";
import { useCollectionForm } from "../../model/use-collection-form";
import type { AdminCollection } from "../../model/types";
import CollectionProducts from "../collection-products";
import styles from "./style.module.scss";

type CollectionFormProps = {
  collection: AdminCollection | null;
  onSaved: (collection: AdminCollection) => void;
};

/** Форма подборки: название, описание, где показывать и состав. */
const CollectionForm = ({ collection, onSaved }: CollectionFormProps) => {
  const { state, change, addProduct, removeProduct, save } = useCollectionForm(collection, onSaved);
  const { fields } = state;

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <Panel title="Основное">
        <FieldGrid>
          <Field label="Название" wide>
            <Input
              ariaLabel="Название"
              maxLength={150}
              value={fields.title}
              onChange={(title) => change({ title })}
            />
          </Field>

          <Field label="Описание" hint="Короткая строка под заголовком блока" wide>
            <Textarea
              ariaLabel="Описание"
              rows={2}
              maxLength={300}
              value={fields.description}
              onChange={(description) => change({ description })}
            />
          </Field>

          <Field label="Порядок" hint="Чем меньше число, тем выше подборка">
            <Input
              ariaLabel="Порядок"
              inputMode="numeric"
              value={fields.sortOrder}
              onChange={(sortOrder) => change({ sortOrder })}
            />
          </Field>
        </FieldGrid>

        <div className={styles.flags}>
          <Checkbox checked={fields.showOnHome} onChange={(showOnHome) => change({ showOnHome })}>
            Показывать на главной
          </Checkbox>
          <Checkbox
            checked={fields.showInCatalog}
            onChange={(showInCatalog) => change({ showInCatalog })}
          >
            Показывать в каталоге
          </Checkbox>
          <Checkbox checked={fields.isActive} onChange={(isActive) => change({ isActive })}>
            Подборка включена
          </Checkbox>
        </div>
      </Panel>

      <CollectionProducts products={fields.products} onAdd={addProduct} onRemove={removeProduct} />

      <Button
        className={styles.submit}
        type="submit"
        loading={state.pending}
        disabled={fields.title.trim().length < 2}
      >
        {collection ? "Сохранить" : "Создать подборку"}
      </Button>
    </form>
  );
};

export default CollectionForm;
