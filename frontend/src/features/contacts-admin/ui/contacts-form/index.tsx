"use client";

import { useState } from "react";
import type { ContactsSettings, ContactTextFields, ContactVisibility } from "@/entities/contacts";
import { CONTACTS_PATH } from "@/shared/config/site";
import Button from "@/shared/ui/button";
import ContactsFields from "../contacts-fields";
import { CONTACT_PANELS } from "../contacts-fields/data";
import styles from "./style.module.scss";

type ContactsFormProps = {
  initialSettings: ContactsSettings;
  saving: boolean;
  onSave: (settings: ContactsSettings) => Promise<ContactsSettings | null>;
};

const ContactsForm = ({ initialSettings, saving, onSave }: ContactsFormProps) => {
  const [settings, setSettings] = useState(initialSettings);

  const changeText = (name: keyof ContactTextFields, value: string) => {
    setSettings((current) => ({ ...current, [name]: value }));
  };

  const changeVisibility = (name: keyof ContactVisibility, checked: boolean) => {
    setSettings((current) => ({ ...current, [name]: checked }));
  };

  const save = async () => {
    const saved = await onSave(settings);
    if (saved) setSettings(saved);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <fieldset className={styles.sections} disabled={saving}>
        {CONTACT_PANELS.map((panel) => (
          <ContactsFields
            key={panel.title}
            panel={panel}
            settings={settings}
            onTextChange={changeText}
            onVisibilityChange={changeVisibility}
          />
        ))}
      </fieldset>

      <div className={styles.actions}>
        <Button type="submit" loading={saving}>Сохранить контакты</Button>
        <Button variant="outline" href={CONTACTS_PATH}>Открыть страницу контактов</Button>
      </div>
    </form>
  );
};

export default ContactsForm;
