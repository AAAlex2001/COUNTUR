import type { ContactsSettings, ContactTextFields, ContactVisibility } from "@/entities/contacts";
import Checkbox from "@/shared/ui/checkbox";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import Textarea from "@/shared/ui/textarea";
import type { ContactsPanel } from "./data";

type ContactsFieldsProps = {
  panel: ContactsPanel;
  settings: ContactsSettings;
  onTextChange: (name: keyof ContactTextFields, value: string) => void;
  onVisibilityChange: (name: keyof ContactVisibility, checked: boolean) => void;
};

const ContactsFields = ({
  panel,
  settings,
  onTextChange,
  onVisibilityChange,
}: ContactsFieldsProps) => (
  <Panel title={panel.title}>
    {panel.toggles?.map(({ name, label }) => (
      <Checkbox
        key={name}
        checked={settings[name]}
        onChange={(checked) => onVisibilityChange(name, checked)}
      >
        {label}
      </Checkbox>
    ))}

    <FieldGrid>
      {panel.fields.map(({ name, label, type, hint, maxLength }) => (
        <Field key={name} label={label} hint={hint} wide={type === "textarea"}>
          {type === "textarea" ? (
            <Textarea
              ariaLabel={label}
              rows={3}
              maxLength={maxLength}
              value={settings[name]}
              onChange={(value) => onTextChange(name, value)}
            />
          ) : (
            <Input
              ariaLabel={label}
              type={type}
              maxLength={maxLength}
              value={settings[name]}
              onChange={(value) => onTextChange(name, value)}
            />
          )}
        </Field>
      ))}
    </FieldGrid>
  </Panel>
);

export default ContactsFields;
