import type { Brand } from "@/entities/product";
import Dropdown from "@/shared/ui/dropdown";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import type { AdminCategory, ProductErrors, ProductFields } from "../../model/types";

const BRANDS_LIST_ID = "product-brands";

type MainFieldsProps = {
  fields: ProductFields;
  errors: ProductErrors;
  categories: AdminCategory[];
  brands: Brand[];
  onChange: (changes: Partial<ProductFields>) => void;
};

/** Основные поля товара: название, категория, бренд и артикул. Бренд вписывается текстом. */
const MainFields = ({ fields, errors, categories, brands, onChange }: MainFieldsProps) => (
  <Panel title="Основное">
    <FieldGrid>
      <Field label="Название" error={errors.name} wide>
        <Input
          ariaLabel="Название"
          maxLength={255}
          value={fields.name}
          onChange={(name) => onChange({ name })}
        />
      </Field>

      <Field label="Категория" error={errors.categoryId}>
        <Dropdown
          value={fields.categoryId}
          options={categories.map((item) => ({ value: String(item.id), label: item.name }))}
          onChange={(categoryId) => onChange({ categoryId })}
        />
      </Field>

      <Field label="Бренд" hint="Если такого бренда ещё нет, он создастся при сохранении">
        <Input
          ariaLabel="Бренд"
          placeholder="Без бренда"
          maxLength={100}
          list={BRANDS_LIST_ID}
          value={fields.brand}
          onChange={(brand) => onChange({ brand })}
        />
        <datalist id={BRANDS_LIST_ID}>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.name} />
          ))}
        </datalist>
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
