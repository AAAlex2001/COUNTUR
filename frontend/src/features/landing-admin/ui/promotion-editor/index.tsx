"use client";

import Image from "next/image";
import Button from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import FieldGrid from "@/shared/ui/field-grid";
import FileButton from "@/shared/ui/file-button";
import Loader from "@/shared/ui/loader";
import Panel from "@/shared/ui/panel";
import TextField from "@/shared/ui/text-field";
import { PROMOTION_TEXT_FIELDS } from "../../model/promotion-fields";
import { usePromotion } from "../../model/use-promotion";
import styles from "./style.module.scss";

/** Редактор акции магазина. */
export default function PromotionEditor() {
  const { fields, failed, retry, pending, change, save, uploadImage } = usePromotion();

  if (!fields) {
    return (
      <Panel title="Рекламный блок">
        {failed ? <Button onClick={retry}>Повторить загрузку</Button> : <Loader />}
      </Panel>
    );
  }

  const uploadButton = (
    <FileButton accept="image/jpeg,image/png,image/webp" loading={pending} onSelect={uploadImage}>
      Загрузить картинку
    </FileButton>
  );

  return (
    <Panel title="Рекламный блок" action={uploadButton}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <fieldset className={styles.fields} disabled={pending}>
          <FieldGrid>
            {PROMOTION_TEXT_FIELDS.map(({ name, label, maxLength, hint, type }) => (
              <TextField
                key={name}
                label={label}
                value={fields[name]}
                onChange={(value) => change({ [name]: value })}
                maxLength={maxLength}
                hint={hint}
                type={type}
                rows={2}
              />
            ))}
          </FieldGrid>

          <div className={styles.preview}>
            {fields.image_url ? (
              <Image src={fields.image_url} alt="" fill sizes="520px" unoptimized className={styles.image} />
            ) : (
              <p className={styles.empty}>Картинка ещё не загружена</p>
            )}
          </div>

          <Checkbox checked={fields.is_visible} onChange={(is_visible) => change({ is_visible })}>
            Показывать блок на главной
          </Checkbox>
          <Button className={styles.submit} type="submit" loading={pending}>Сохранить</Button>
        </fieldset>
      </form>
    </Panel>
  );
}
