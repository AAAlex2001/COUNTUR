"use client";

import Image from "next/image";
import Button from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import FileButton from "@/shared/ui/file-button";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import Textarea from "@/shared/ui/textarea";
import { usePromotion } from "../../model/use-promotion";
import styles from "./style.module.scss";

const IMAGE_TYPES = "image/jpeg,image/png,image/webp";

/** Рекламный блок главной: тексты, кнопка, картинка и галочка «показывать на главной». */
const PromotionEditor = () => {
  const { state, change, save, uploadImage } = usePromotion();
  const { fields } = state;

  return (
    <Panel
      title="Рекламный блок"
      action={
        <FileButton accept={IMAGE_TYPES} loading={state.pending} onSelect={uploadImage}>
          Загрузить картинку
        </FileButton>
      }
    >
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <FieldGrid>
          <Field label="Надстрочник" hint="Например: «Только до 15 октября»">
            <Input
              ariaLabel="Надстрочник"
              maxLength={100}
              value={fields.label}
              onChange={(label) => change({ label })}
            />
          </Field>

          <Field label="Заголовок">
            <Input
              ariaLabel="Заголовок"
              maxLength={150}
              value={fields.title}
              onChange={(title) => change({ title })}
            />
          </Field>

          <Field label="Описание" wide>
            <Textarea
              ariaLabel="Описание"
              rows={2}
              maxLength={300}
              value={fields.text}
              onChange={(text) => change({ text })}
            />
          </Field>

          <Field label="Надпись на кнопке">
            <Input
              ariaLabel="Надпись на кнопке"
              maxLength={60}
              value={fields.button_label}
              onChange={(button_label) => change({ button_label })}
            />
          </Field>

          <Field label="Ссылка кнопки" hint="Например: /catalog?category=video-cards">
            <Input
              ariaLabel="Ссылка кнопки"
              maxLength={255}
              value={fields.button_url}
              onChange={(button_url) => change({ button_url })}
            />
          </Field>
        </FieldGrid>

        <div className={styles.preview}>
          {state.imageUrl ? (
            <Image
              src={state.imageUrl}
              alt=""
              fill
              sizes="520px"
              unoptimized
              className={styles.image}
            />
          ) : (
            <p className={styles.empty}>Картинка ещё не загружена</p>
          )}
        </div>

        <Checkbox checked={fields.is_visible} onChange={(is_visible) => change({ is_visible })}>
          Показывать блок на главной
        </Checkbox>

        <Button className={styles.submit} type="submit" loading={state.pending}>
          Сохранить
        </Button>
      </form>
    </Panel>
  );
};

export default PromotionEditor;
