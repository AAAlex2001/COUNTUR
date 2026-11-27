import type { ContactsSettings } from "@/entities/contacts";
import { FeedbackForm } from "@/features/feedback";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import ContactChannels from "./ui/contact-channels";
import ContactCompany from "./ui/contact-company";
import StoreLocation from "./ui/store-location";
import styles from "./style.module.scss";

type ContactsProps = {
  settings: ContactsSettings;
};

/** Выводит включённые разделы страницы контактов. */
const Contacts = ({ settings }: ContactsProps) => (
  <section className={styles.page}>
    <div className={styles.intro}>
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />

      <div className={styles.heading}>
        {settings.eyebrow && <p className={styles.eyebrow}>{settings.eyebrow}</p>}
        {settings.title && <h1 className={styles.title}>{settings.title}</h1>}
        {settings.description && <p className={styles.description}>{settings.description}</p>}
      </div>
    </div>

    <hr className={styles.divider} />
    <ContactChannels settings={settings} />
    <StoreLocation settings={settings} />

    <div className={styles.columns}>
      {settings.show_feedback && (
        <section className={styles.feedback}>
          {(settings.feedback_title || settings.feedback_description) && (
            <div className={styles.feedbackIntro}>
              {settings.feedback_title && (
                <h2 className={styles.cardTitle}>{settings.feedback_title}</h2>
              )}
              {settings.feedback_description && (
                <p className={styles.feedbackText}>{settings.feedback_description}</p>
              )}
            </div>
          )}
          <FeedbackForm />
        </section>
      )}
      <ContactCompany settings={settings} />
    </div>
  </section>
);

export default Contacts;
