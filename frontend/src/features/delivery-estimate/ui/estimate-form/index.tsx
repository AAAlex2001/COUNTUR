"use client";

import type { FormEvent } from "react";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";
import SectionHeading from "@/shared/ui/section-heading";
import { useToast } from "@/shared/ui/toaster";
import { PARCEL_FIELDS } from "../../config/parcel-fields";
import { useDeliveryEstimate } from "../../model/use-delivery-estimate";
import TariffList from "../tariff-list";
import styles from "./style.module.scss";

const CITY_LABEL = "Город или почтовый индекс получения";

/** Форма расчёта доставки. */
export default function EstimateForm() {
  const { pending, tariffs, calculate, clearTariffs } = useDeliveryEstimate();
  const toast = useToast();

  /** Отправить параметры посылки. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fields = new FormData(event.currentTarget);
    const city = String(fields.get("city") ?? "").trim();
    if (city.length < 2) {
      toast("Введите город или почтовый индекс", "error");
      return;
    }

    void calculate({
      city,
      weight: Number(fields.get("weight")),
      length: Number(fields.get("length")),
      width: Number(fields.get("width")),
      height: Number(fields.get("height")),
    });
  }

  /** Показать ошибку поля. */
  function showInvalidField(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (event.currentTarget.querySelector("input:invalid") !== input) return;

    input.focus();
    toast(`${input.getAttribute("aria-label")}. ${input.validationMessage}`, "error");
  }

  return (
    <form className={styles.form} onSubmit={submit} onInvalid={showInvalidField} onChange={clearTariffs}>
      <SectionHeading title="Расчёт доставки СДЭК" />

      <fieldset className={styles.fields} disabled={pending} aria-label="Параметры доставки">
        <Field label={CITY_LABEL} plain>
          <Input name="city" ariaLabel={CITY_LABEL} required minLength={2} maxLength={120} />
        </Field>

        {PARCEL_FIELDS.map(({ name, label, max }) => (
          <Field key={name} label={label} plain>
            <Input type="number" name={name} ariaLabel={label} required min={1} max={max} />
          </Field>
        ))}
      </fieldset>

      <Button type="submit" loading={pending}>Рассчитать доставку</Button>
      {tariffs.length > 0 && <TariffList tariffs={tariffs} />}
    </form>
  );
}
