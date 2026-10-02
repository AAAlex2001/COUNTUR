import { AVAILABILITY_LABELS, type Availability } from "@/entities/product";
import Checkbox from "@/shared/ui/checkbox";
import Dropdown from "@/shared/ui/dropdown";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import type { ProductFields } from "../../model/types";

const AVAILABILITY_OPTIONS = Object.entries(AVAILABILITY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

type PriceFieldsProps = {
  fields: ProductFields;
  onChange: (changes: Partial<ProductFields>) => void;
};

/** Цена, скидка, наличие, остаток и метка «Хит». */
const PriceFields = ({ fields, onChange }: PriceFieldsProps) => (
  <Panel title="Цена и наличие">
    <FieldGrid>
      <Field label="Цена, ₽">
        <Input
          ariaLabel="Цена"
          inputMode="decimal"
          value={fields.price}
          onChange={(price) => onChange({ price })}
        />
      </Field>

      <Field label="Цена до скидки, ₽" hint="Пусто — товар без скидки">
        <Input
          ariaLabel="Цена до скидки"
          inputMode="decimal"
          value={fields.oldPrice}
          onChange={(oldPrice) => onChange({ oldPrice })}
        />
      </Field>

      <Field label="Наличие">
        <Dropdown
          value={fields.availability}
          options={AVAILABILITY_OPTIONS}
          onChange={(availability) => onChange({ availability: availability as Availability })}
        />
      </Field>

      <Field label="Остаток, шт." hint="Пусто — остаток не учитывается">
        <Input
          ariaLabel="Остаток"
          inputMode="numeric"
          value={fields.stockQuantity}
          onChange={(stockQuantity) => onChange({ stockQuantity })}
        />
      </Field>

      <Checkbox checked={fields.isHit} onChange={(isHit) => onChange({ isHit })}>
        Показывать метку «Хит»
      </Checkbox>
    </FieldGrid>
  </Panel>
);

export default PriceFields;
