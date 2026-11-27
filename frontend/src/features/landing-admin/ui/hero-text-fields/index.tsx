import type { HeroContent } from "@/entities/landing";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Textarea from "@/shared/ui/textarea";
import { ACTION_AND_IMAGE_FIELDS, HEADING_FIELDS } from "../../model/hero-text-fields";
import type { HeroTextField } from "../../model/types";

type HeroTextFieldsProps = {
  content: HeroContent;
  onChange: (changes: Partial<HeroContent>) => void;
};

/** Редактирует заголовки, подписи кнопок и текст изображения. */
export default function HeroTextFields({ content, onChange }: HeroTextFieldsProps) {
  const renderField = ({ name, label, maxLength }: HeroTextField) => (
    <Field key={name} label={label}>
      <Input
        ariaLabel={label}
        value={content[name]}
        maxLength={maxLength}
        onChange={(value) => onChange({ [name]: value })}
      />
    </Field>
  );

  return (
    <FieldGrid>
      {HEADING_FIELDS.map(renderField)}
      <Field label="Подзаголовок" wide>
        <Textarea
          ariaLabel="Подзаголовок"
          value={content.description}
          rows={3}
          maxLength={500}
          onChange={(description) => onChange({ description })}
        />
      </Field>
      {ACTION_AND_IMAGE_FIELDS.map(renderField)}
    </FieldGrid>
  );
}
