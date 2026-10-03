import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import type { AdminCategory, ProductFields } from "../../model/types";
import AttributeForm from "../attribute-form";
import styles from "./style.module.scss";

type SpecFieldsProps = {
  fields: ProductFields;
  category: AdminCategory;
  onChange: (changes: Partial<ProductFields>) => void;
  onCategoryChange: (category: AdminCategory) => void;
};

/** Характеристики товара: по полю на каждый параметр категории и строка для нового параметра. */
const SpecFields = ({ fields, category, onChange, onCategoryChange }: SpecFieldsProps) => (
  <Panel title="Характеристики">
    {category.attributes.length === 0 && (
      <p className={styles.empty}>
        У категории «{category.name}» пока нет параметров — добавьте первый ниже.
      </p>
    )}

    {category.attributes.length > 0 && (
      <FieldGrid>
        {category.attributes.map((attribute) => (
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
    )}

    <AttributeForm category={category} onSaved={onCategoryChange} />
  </Panel>
);

export default SpecFields;
