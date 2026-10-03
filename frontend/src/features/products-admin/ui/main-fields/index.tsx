import type { Brand } from "@/entities/product";
import Dropdown from "@/shared/ui/dropdown";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import type { AdminCategory, ProductFields } from "../../model/types";

type MainFieldsProps = {
  fields: ProductFields;
  categories: AdminCategory[];
  brands: Brand[];
  onChange: (changes: Partial<ProductFields>) => void;
};

/** Основные поля товара: название, категория, бренд и артикул. */
const MainFields = ({ fields, categories, brands, onChange }: MainFieldsProps) => (
  <Panel title="Основное">
    <FieldGrid>
      <Field label="Название" wide>
        <Input
          ariaLabel="Название"
          maxLength={255}
          value={fields.name}
          onChange={(name) => onChange({ name })}
        />
      </Field>

      <Field label="Категория">
        <Dropdown
          value={fields.categoryId}
          options={categories.map((item) => ({ value: String(item.id), label: item.name }))}
          onChange={(categoryId) => onChange({ categoryId })}
        />
      </Field>

      <Field label="Бренд">
        <Dropdown
          value={fields.brandId}
          options={[
            { value: "", label: "Без бренда" },
            ...brands.map((brand) => ({ value: String(brand.id), label: brand.name })),
          ]}
          onChange={(brandId) => onChange({ brandId })}
        />
      </Field>

      <Field label="Артикул">
        <Input
          ariaLabel="Артикул"
          maxLength={64}
          value={fields.sku}
          onChange={(sku) => onChange({ sku })}
        />
      </Field>

      <Field label="Порядок в каталоге" hint="Чем меньше число, тем выше товар">
        <Input
          ariaLabel="Порядок в каталоге"
          inputMode="numeric"
          value={fields.sortOrder}
          onChange={(sortOrder) => onChange({ sortOrder })}
        />
      </Field>
    </FieldGrid>
  </Panel>
);

export default MainFields;
