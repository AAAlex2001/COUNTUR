"use client";

import Link from "next/link";
import Button from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import { ArrowRightIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import Textarea from "@/shared/ui/textarea";
import { useFeedbackForm } from "../../model/use-feedback-form";
import styles from "./style.module.scss";

/** Форма «Напишите нам». После отправки показывает подтверждение и кнопку «Написать ещё». */
const FeedbackForm = () => {
  const { state, change, send, reset } = useFeedbackForm();
  const { fields } = state;

  if (state.sent) {
    return (
      <div className={styles.done}>
        <p className={styles.doneTitle}>Сообщение отправлено</p>
        <p className={styles.doneText}>Ответим на указанную почту в ближайший рабочий день.</p>
        <Button variant="outline" onClick={reset}>
          Написать ещё
        </Button>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        send();
      }}
    >
      <FieldGrid>
        <Field label="Имя" plain>
          <Input
            size="lg"
            ariaLabel="Имя"
            autoComplete="name"
            placeholder="Как к вам обращаться"
            maxLength={150}
            value={fields.name}
            onChange={(name) => change({ name })}
          />
        </Field>

        <Field label="Email" plain>
          <Input
            size="lg"
            type="email"
            ariaLabel="Email"
            autoComplete="email"
            placeholder="Ваша электронная почта"
            maxLength={254}
            value={fields.email}
            onChange={(email) => change({ email })}
          />
        </Field>

        <Field label="Тема" plain wide>
          <Input
            size="lg"
            ariaLabel="Тема"
            placeholder="Тема обращения"
            maxLength={200}
            value={fields.subject}
            onChange={(subject) => change({ subject })}
          />
        </Field>

        <Field label="Сообщение" plain wide>
          <Textarea
            ariaLabel="Сообщение"
            placeholder="Опишите ваш вопрос…"
            rows={5}
            maxLength={5000}
            value={fields.message}
            onChange={(message) => change({ message })}
          />
        </Field>
      </FieldGrid>

      <Checkbox size="lg" checked={fields.consent} onChange={(consent) => change({ consent })}>
        Я даю согласие на{" "}
        <Link className={styles.link} href="/personal-data">
          обработку персональных данных
        </Link>{" "}
        для рассмотрения обращения и ознакомлен(а) с{" "}
        <Link className={styles.link} href="/privacy">
          политикой конфиденциальности
        </Link>
        .
      </Checkbox>

      <Button className={styles.submit} type="submit" loading={state.pending}>
        Отправить сообщение
        <ArrowRightIcon />
      </Button>
    </form>
  );
};

export default FeedbackForm;
