import { FeedbackForm } from "@/features/feedback";
import {
  COMPANY_REQUISITES,
  COMPANY_REQUISITES_NOTE,
  SITE_DOCUMENTS,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
} from "@/shared/config/site";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import Button from "@/shared/ui/button";
import { ArrowRightIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/shared/ui/icons";
import RequisitesCard from "@/shared/ui/requisites-card";
import ChannelCard from "./ui/channel-card";
import styles from "./style.module.scss";

const VISIT = [
  ["Адрес", "[Адрес магазина или пункта выдачи]"],
  ["Режим работы", "[Дни и часы работы]"],
  ["Как добраться", "[Инструкция для посетителей]"],
];

/** Страница контактов: каналы связи, адрес с картой, форма обращения и реквизиты. */
const Contacts = () => (
  <section className={styles.page}>
    <div className={styles.intro}>
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />

      <div className={styles.heading}>
        <p className={styles.eyebrow}>Связь и поддержка</p>
        <h1 className={styles.title}>Контакты</h1>
        <p className={styles.description}>
          Свяжитесь с нами по вопросам заказа, доставки, гарантии или подбора комплектующих.
          Выберите удобный канал или оставьте сообщение.
        </p>
      </div>
    </div>

    <hr className={styles.divider} />

    <div className={styles.channels}>
      <ChannelCard
        icon={<PhoneIcon />}
        label="Телефон магазина"
        value={SUPPORT_PHONE}
        href={`tel:${SUPPORT_PHONE.replace(/[^\d+]/g, "")}`}
        text="Вопросы о товарах и заказах."
      />
      <ChannelCard
        icon={<MailIcon />}
        label="Электронная почта"
        value={SUPPORT_EMAIL}
        href={`mailto:${SUPPORT_EMAIL}`}
        text="Обращения в поддержку магазина."
      />
    </div>

    <div className={styles.visit}>
      <div className={styles.address}>
        <h2 className={styles.cardTitle}>Адрес и режим работы</h2>

        {VISIT.map(([label, value]) => (
          <div className={styles.visitItem} key={label}>
            <span className={styles.visitLabel}>{label}</span>
            <span className={styles.visitValue}>{value}</span>
          </div>
        ))}

        <p className={styles.note}>Адрес и время посещения необходимо заполнить перед публикацией.</p>
      </div>

      <div className={styles.map}>
        <div className={styles.mapCard}>
          <MapPinIcon className={styles.mapIcon} />
          <p className={styles.mapTitle}>Карта будет добавлена</p>
          <p className={styles.mapText}>
            После заполнения адреса подключите карту с подтверждённой точкой магазина.
          </p>
          <span className={styles.mapField}>[Ссылка или код карты]</span>
        </div>
      </div>
    </div>

    <div className={styles.columns}>
      <div className={styles.feedback}>
        <div className={styles.feedbackIntro}>
          <h2 className={styles.cardTitle}>Напишите нам</h2>
          <p className={styles.feedbackText}>
            Расскажите, с чем нужна помощь. Для вопроса по заказу укажите его номер.
          </p>
        </div>

        <FeedbackForm />
      </div>

      <aside className={styles.company}>
        <RequisitesCard
          title="Реквизиты компании"
          items={COMPANY_REQUISITES}
          note={COMPANY_REQUISITES_NOTE}
        />

        <nav className={styles.documents} aria-label="Документы магазина">
          <p className={styles.documentsTitle}>Документы магазина</p>
          {SITE_DOCUMENTS.map((document) => (
            <Button variant="ghost" size="sm" href={document.href} key={document.href}>
              {document.label}
              <ArrowRightIcon />
            </Button>
          ))}
        </nav>
      </aside>
    </div>
  </section>
);

export default Contacts;
