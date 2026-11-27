"use client";

import { ContactsForm, useContactsSettings } from "@/features/contacts-admin";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** Открывает редактор после загрузки настроек контактов. */
const AdminContacts = () => {
  const { settings, loadError, saving, change, save } = useContactsSettings();

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Контакты</h1>
      {loadError && <p className={styles.error} role="alert">{loadError}</p>}
      {!settings && !loadError && <Loader size="lg" />}
      {settings && <ContactsForm settings={settings} saving={saving} onChange={change} onSave={save} />}
    </section>
  );
};

export default AdminContacts;
