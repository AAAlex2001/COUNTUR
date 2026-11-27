"use client";

import Button from "@/shared/ui/button";
import { PARCEL_FIELDS } from "../../model/parcel-fields";
import { useDeliveryEstimate } from "../../model/use-delivery-estimate";
import TariffList from "../tariff-list";
import styles from "./style.module.scss";

/** Принимает параметры посылки и показывает ответ калькулятора СДЭК. */
export default function EstimateForm() {
  const { state, submit } = useDeliveryEstimate();
  const pending = state.status === "pending";

  return (
    <form className={styles.form} onSubmit={submit}>
      <fieldset className={styles.fields} disabled={pending}>
        <legend className={styles.legend}>Расчёт доставки СДЭК</legend>
        <label className={styles.field}>
          Город получения
          <input className={styles.input} name="city" required minLength={2} maxLength={120} />
        </label>
        {PARCEL_FIELDS.map(({ name, label, max }) => (
          <label key={name} className={styles.field}>
            {label}
            <input className={styles.input} name={name} type="number" required min={1} max={max} step={1} />
          </label>
        ))}
      </fieldset>

      <Button type="submit" loading={pending}>Рассчитать доставку</Button>
      {state.status === "error" && <p role="alert">{state.message}</p>}
      {state.status === "success" && <TariffList tariffs={state.tariffs} />}
    </form>
  );
}
