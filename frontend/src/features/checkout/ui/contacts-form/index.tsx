import Link from "next/link";
import { PERSONAL_DATA_PATH, TERMS_PATH } from "@/shared/config/site";
import Button from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import { ArrowRightIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import type { ContactFields } from "../../model/types";
import styles from "./style.module.scss";

type ContactsFormProps = {
  contacts: ContactFields;
  consent: boolean;
  onChange: (changes: Partial<ContactFields>) => void;
  onConsentChange: (value: boolean) => void;
  onSubmit: () => void;
};

/** Первый шаг оформления заказа: контактные данные покупателя и согласие на их обработку. */
const ContactsForm = ({
  contacts,
  consent,
  onChange,
  onConsentChange,
  onSubmit,
}: ContactsFormProps) => (
  <form
    className={styles.form}
    noValidate
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <FieldGrid>
      <Field label="Имя *">
        <Input
          size="lg"
          ariaLabel="Имя"
          autoComplete="given-name"
          maxLength={70}
          value={contacts.firstName}
          onChange={(firstName) => onChange({ firstName })}
        />
      </Field>

      <Field label="Фамилия *">
        <Input
          size="lg"
          ariaLabel="Фамилия"
          autoComplete="family-name"
          maxLength={70}
          value={contacts.lastName}
          onChange={(lastName) => onChange({ lastName })}
        />
      </Field>

      <Field label="Телефон *">
        <Input
          size="lg"
          type="tel"
          ariaLabel="Телефон"
          autoComplete="tel"
          placeholder="+7 999 000-00-00"
          maxLength={32}
          value={contacts.phone}
          onChange={(phone) => onChange({ phone })}
        />
      </Field>

      <Field label="Email *">
        <Input
          size="lg"
          type="email"
          ariaLabel="Email"
          autoComplete="email"
          maxLength={254}
          value={contacts.email}
          onChange={(email) => onChange({ email })}
        />
      </Field>

      <Field label="Город *" wide>
        <Input
          size="lg"
          ariaLabel="Город"
          autoComplete="address-level2"
          maxLength={100}
          value={contacts.city}
          onChange={(city) => onChange({ city })}
        />
      </Field>
    </FieldGrid>

    <Checkbox checked={consent} onChange={onConsentChange}>
      Согласен на{" "}
      <Link className={styles.link} href={PERSONAL_DATA_PATH}>
        обработку персональных данных
      </Link>{" "}
      и с{" "}
      <Link className={styles.link} href={TERMS_PATH}>
        условиями заказа
      </Link>
    </Checkbox>

    <Button className={styles.submit} type="submit">
      <ArrowRightIcon className={styles.icon} />
      Далее
    </Button>
  </form>
);

export default ContactsForm;
