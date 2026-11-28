import { useState, type FormEvent } from "react";
import Button from "@/shared/ui/button";
import TextField from "@/shared/ui/text-field";
import styles from "./style.module.scss";

type TrackingNumberFieldProps = {
  value: string;
  pending: boolean;
  onSave: (trackingNumber: string) => void;
};

/** Редактировать трек-номер заказа. */
export default function TrackingNumberField({ value, pending, onSave }: TrackingNumberFieldProps) {
  const [draft, setDraft] = useState(value);
  const trackingNumber = draft.trim();
  const canSave = !pending && trackingNumber !== "" && trackingNumber !== value;

  /** Сохранить трек-номер. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSave) onSave(trackingNumber);
  }

  return (
    <form className={styles.controls} onSubmit={submit}>
      <TextField label="Трек-номер" value={draft} maxLength={100} onChange={setDraft} />
      <Button type="submit" variant="outline" disabled={!canSave}>
        Сохранить трек-номер
      </Button>
    </form>
  );
}
