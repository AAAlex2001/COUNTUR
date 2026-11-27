import type { HeroContent } from "@/entities/landing";
import FieldGrid from "@/shared/ui/field-grid";
import TextField from "@/shared/ui/text-field";
import { HERO_TEXT_FIELDS } from "../../model/hero-text-fields";

type HeroTextFieldsProps = {
  content: HeroContent;
  onChange: (changes: Partial<HeroContent>) => void;
};

/** Поля первого экрана. */
export default function HeroTextFields({ content, onChange }: HeroTextFieldsProps) {
  return (
    <FieldGrid>
      {HERO_TEXT_FIELDS.map(({ name, label, maxLength, type }) => (
        <TextField
          key={name}
          label={label}
          maxLength={maxLength}
          type={type}
          value={content[name]}
          onChange={(value) => onChange({ [name]: value })}
        />
      ))}
    </FieldGrid>
  );
}
