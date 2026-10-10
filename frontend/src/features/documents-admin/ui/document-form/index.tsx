"use client";

import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import RichEditor from "@/shared/ui/rich-editor";
import Textarea from "@/shared/ui/textarea";
import type { DocumentFields } from "../../model/types";
import styles from "./style.module.scss";

type DocumentFormProps = {
  fields: DocumentFields;
  pending: boolean;
  onChange: (changes: Partial<DocumentFields>) => void;
  onSave: () => void;
};

/** Форма документа: название, подзаголовок и текст в редакторе. */
const DocumentForm = ({ fields, pending, onChange, onSave }: DocumentFormProps) => (
  <form
    className={styles.form}
    onSubmit={(event) => {
      event.preventDefault();
      onSave();
    }}
  >
    <Panel title="Шапка страницы">
      <FieldGrid>
        <Field label="Название" wide>
          <Input
            ariaLabel="Название"
            maxLength={200}
            value={fields.title}
            onChange={(title) => onChange({ title })}
          />
        </Field>

        <Field label="Подзаголовок" hint="Строка под названием на странице" wide>
          <Textarea
            ariaLabel="Подзаголовок"
            rows={2}
            maxLength={500}
            value={fields.description}
            onChange={(description) => onChange({ description })}
          />
        </Field>
      </FieldGrid>
    </Panel>

    <Panel title="Текст документа">
      <p className={styles.hint}>
        Каждый «Заголовок раздела» становится пунктом оглавления и нумеруется сам. «Выделенный блок» —
        для реквизитов и полей, которые нужно заметить.
      </p>

      <RichEditor
        ariaLabel="Текст документа"
        value={fields.content}
        onChange={(content) => onChange({ content })}
      />
    </Panel>

    <Button className={styles.submit} type="submit" loading={pending}>
      Сохранить
    </Button>
  </form>
);

export default DocumentForm;
