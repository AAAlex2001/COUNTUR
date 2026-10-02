import Field from "@/shared/ui/field";
import Panel from "@/shared/ui/panel";
import Textarea from "@/shared/ui/textarea";
import type { ProductFields } from "../../model/types";

type DescriptionFieldsProps = {
  fields: ProductFields;
  onChange: (changes: Partial<ProductFields>) => void;
};

/** Тексты товара: краткое и полное описание, ключевые характеристики. */
const DescriptionFields = ({ fields, onChange }: DescriptionFieldsProps) => (
  <Panel title="Описание">
    <Field label="Краткое описание">
      <Textarea
        ariaLabel="Краткое описание"
        rows={3}
        maxLength={500}
        value={fields.shortDescription}
        onChange={(shortDescription) => onChange({ shortDescription })}
      />
    </Field>

    <Field label="Полное описание">
      <Textarea
        ariaLabel="Полное описание"
        rows={8}
        value={fields.description}
        onChange={(description) => onChange({ description })}
      />
    </Field>

    <Field label="Ключевые характеристики" hint="Каждая с новой строки, не больше восьми">
      <Textarea
        ariaLabel="Ключевые характеристики"
        value={fields.highlights}
        onChange={(highlights) => onChange({ highlights })}
      />
    </Field>
  </Panel>
);

export default DescriptionFields;
