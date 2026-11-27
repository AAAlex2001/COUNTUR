"use client";

import type { ContactsSettings } from "@/entities/contacts";
import { CONTACTS_PATH } from "@/shared/config/site";
import Button from "@/shared/ui/button";
import type { ChangeContact } from "../../model/types";
import { CONTACT_PANELS } from "../../model/panels";
import ContactsFields from "../contacts-fields";
import styles from "./style.module.scss";

type ContactsFormProps = {
  settings: ContactsSettings;
  saving: boolean;
  onChange: ChangeContact;
  onSave: () => Promise<void>;
};

/** Отображает секции формы и отправляет изменения контактов. */
const ContactsForm = ({ settings, saving, onChange, onSave }: ContactsFormProps) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSave();
      }}
    >
      <fieldset className={styles.sections} disabled={saving}>
        {CONTACT_PANELS.map((panel) => (
          <ContactsFields
            key={panel.title}
            panel={panel}
            settings={settings}
            onChange={onChange}
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
