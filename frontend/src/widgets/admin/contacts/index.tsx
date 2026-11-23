"use client";

import { ContactsForm, useContactsSettings } from "@/features/contacts-admin";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

const AdminContacts = () => {
  const { settings, loadError, saving, save } = useContactsSettings();

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Контакты</h1>
      {loadError && <p className={styles.error} role="alert">{loadError}</p>}
      {!settings && !loadError && <Loader size="lg" />}
      {settings && <ContactsForm initialSettings={settings} saving={saving} onSave={save} />}
    </section>
  );
};

export default AdminContacts;
