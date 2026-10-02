import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import type { AdminAttribute, ProductFields } from "../../model/types";

type SpecFieldsProps = {
  fields: ProductFields;
  attributes: AdminAttribute[];
  onChange: (changes: Partial<ProductFields>) => void;
};

/** Характеристики товара: по полю на каждый параметр выбранной категории. */
const SpecFields = ({ fields, attributes, onChange }: SpecFieldsProps) => (
  <Panel title="Характеристики">
    <FieldGrid>
      {attributes.map((attribute) => (
        <Field key={attribute.id} label={`${attribute.group} · ${attribute.name}`}>
          <Input
            ariaLabel={attribute.name}
            maxLength={255}
            value={fields.specs[attribute.id] ?? ""}
            onChange={(value) => onChange({ specs: { ...fields.specs, [attribute.id]: value } })}
          />
        </Field>
      ))}
    </FieldGrid>
  </Panel>
);

export default SpecFields;
