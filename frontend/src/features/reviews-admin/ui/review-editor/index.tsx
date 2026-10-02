import Button from "@/shared/ui/button";
import Dropdown from "@/shared/ui/dropdown";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Textarea from "@/shared/ui/textarea";
import type { ReviewFields } from "../../model/types";
import styles from "./style.module.scss";

const RATING_OPTIONS = ["5", "4", "3", "2", "1"].map((value) => ({ value, label: value }));

type ReviewEditorProps = {
  fields: ReviewFields;
  pending: boolean;
  onChange: (changes: Partial<ReviewFields>) => void;
  onSave: () => void;
  onCancel: () => void;
};

/** Правка отзыва на месте: автор, оценка и текст. */
const ReviewEditor = ({ fields, pending, onChange, onSave, onCancel }: ReviewEditorProps) => (
  <form
    className={styles.editor}
    onSubmit={(event) => {
      event.preventDefault();
      onSave();
    }}
  >
    <FieldGrid>
      <Field label="Автор">
        <Input
          ariaLabel="Автор отзыва"
          maxLength={100}
          value={fields.author}
          onChange={(author) => onChange({ author })}
        />
      </Field>

      <Field label="Оценка">
        <Dropdown
          value={fields.rating}
          options={RATING_OPTIONS}
          onChange={(rating) => onChange({ rating })}
        />
      </Field>

      <Field label="Текст" wide>
        <Textarea
          ariaLabel="Текст отзыва"
          maxLength={5000}
          value={fields.text}
          onChange={(text) => onChange({ text })}
        />
      </Field>
    </FieldGrid>

    <div className={styles.actions}>
      <Button type="submit" loading={pending}>
        Сохранить
      </Button>

      <Button variant="outline" disabled={pending} onClick={onCancel}>
        Отмена
      </Button>
    </div>
  </form>
);

export default ReviewEditor;
