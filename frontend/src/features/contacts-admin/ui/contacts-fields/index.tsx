import type { ContactsSettings } from "@/entities/contacts";
import Checkbox from "@/shared/ui/checkbox";
import FieldGrid from "@/shared/ui/field-grid";
import Panel from "@/shared/ui/panel";
import TextField from "@/shared/ui/text-field";
import type { ChangeContact, ContactsPanel } from "../../model/types";

type ContactsFieldsProps = {
  panel: ContactsPanel;
  settings: ContactsSettings;
  onChange: ChangeContact;
};

/** Показывает поля и переключатели одной секции контактов. */
const ContactsFields = ({
  panel,
  settings,
  onChange,
}: ContactsFieldsProps) => (
  <Panel title={panel.title}>
    {panel.toggles?.map(({ name, label }) => (
      <Checkbox
        key={name}
        checked={settings[name]}
        onChange={(checked) => onChange(name, checked)}
      >
        {label}
      </Checkbox>
    ))}

    <FieldGrid>
      {panel.fields.map(({ name, label, type, hint, maxLength }) => (
        <TextField
          key={name}
          label={label}
          hint={hint}
          type={type}
          maxLength={maxLength}
          value={settings[name]}
          onChange={(value) => onChange(name, value)}
        />
      ))}
    </FieldGrid>
  </Panel>
);

export default ContactsFields;
