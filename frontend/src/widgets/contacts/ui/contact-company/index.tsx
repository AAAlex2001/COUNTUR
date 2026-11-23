import { getOperatorRequisites, type ContactsSettings } from "@/entities/contacts";
import { SITE_DOCUMENTS } from "@/shared/config/site";
import Button from "@/shared/ui/button";
import { ArrowRightIcon } from "@/shared/ui/icons";
import RequisitesCard from "@/shared/ui/requisites-card";
import styles from "../../style.module.scss";

type ContactCompanyProps = {
  settings: ContactsSettings;
};

const ContactCompany = ({ settings }: ContactCompanyProps) => {
  const requisites = getOperatorRequisites(settings);
  const showRequisites = settings.show_requisites && (requisites.length > 0 || settings.operator_note);

  if (!showRequisites && !settings.show_documents) return null;

  return (
    <aside className={styles.company}>
      {showRequisites && (
        <RequisitesCard
          title={settings.company_title}
          items={requisites}
          note={settings.operator_note}
        />
      )}
      {settings.show_documents && (
        <nav className={styles.documents} aria-label={settings.documents_title || "Документы магазина"}>
          {settings.documents_title && <p className={styles.documentsTitle}>{settings.documents_title}</p>}
          {SITE_DOCUMENTS.map((document) => (
            <Button variant="ghost" size="sm" href={document.href} key={document.href}>
              {document.label}
              <ArrowRightIcon />
            </Button>
          ))}
        </nav>
      )}
    </aside>
  );
};

export default ContactCompany;
