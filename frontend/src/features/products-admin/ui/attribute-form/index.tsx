"use client";

import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";
import { useAttributeForm } from "../../model/use-attribute-form";
import type { AdminCategory } from "../../model/types";
import styles from "./style.module.scss";

type AttributeFormProps = {
  category: AdminCategory;
  onSaved: (category: AdminCategory) => void;
};

/** Строка «добавить параметр»: группа, название и кнопка. Параметр появится у всей категории. */
const AttributeForm = ({ category, onSaved }: AttributeFormProps) => {
  const { state, change, save } = useAttributeForm(category, onSaved);
  const { fields } = state;

  return (
    <div className={styles.form}>
      <Field label="Группа">
        <Input
          ariaLabel="Группа параметра"
          maxLength={60}
          placeholder="Общие"
          value={fields.group}
          onChange={(group) => change({ group })}
        />
      </Field>

      <Field label="Новый параметр" hint={`Добавится ко всем товарам категории «${category.name}»`}>
        <Input
          ariaLabel="Название параметра"
          maxLength={100}
          placeholder="Например, Сокет"
          value={fields.name}
          onChange={(name) => change({ name })}
        />
      </Field>

      <Button
        className={styles.submit}
        variant="outline"
        loading={state.pending}
        disabled={!fields.name.trim()}
        onClick={save}
      >
        Добавить
      </Button>
    </div>
  );
};

export default AttributeForm;
