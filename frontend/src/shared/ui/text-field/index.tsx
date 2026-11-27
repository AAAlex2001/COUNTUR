import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";
import Textarea from "@/shared/ui/textarea";

type TextFieldProps = {
  label: string;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
  type?: "email" | "tel" | "textarea";
  hint?: string;
  rows?: number;
};

/** Текстовое поле с подписью. */
export default function TextField({ label, value, maxLength, onChange, type, hint, rows = 3 }: TextFieldProps) {
  const input = { ariaLabel: label, value, maxLength, onChange };

  return (
    <Field label={label} hint={hint} wide={type === "textarea"}>
      {type === "textarea" ? <Textarea {...input} rows={rows} /> : <Input {...input} type={type} />}
    </Field>
  );
}
