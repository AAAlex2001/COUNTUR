"use client";

import Button from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Loader from "@/shared/ui/loader";
import Panel from "@/shared/ui/panel";
import Textarea from "@/shared/ui/textarea";
import { useHeroContent } from "../../model/use-hero-content";
import HeroStatisticFields from "../hero-statistic-fields";
import styles from "./style.module.scss";

const HeroContentEditor = () => {
  const { state, change, save } = useHeroContent();
  const { fields, error, pending } = state;

  if (!fields) {
    return (
      <Panel title="Тексты первого экрана">
        {error ? <p className={styles.error} role="alert">{error}</p> : <Loader />}
      </Panel>
    );
  }

  return (
    <Panel title="Тексты первого экрана">
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <fieldset className={styles.fields} disabled={pending}>
          <Checkbox
            checked={fields.is_visible}
            onChange={(isVisible) => change({ ...fields, is_visible: isVisible })}
          >
            Показывать первый экран на главной
          </Checkbox>
          <p className={styles.hint}>Очистите поле, чтобы скрыть его текст на сайте.</p>

          <FieldGrid>
            <Field label="Надзаголовок">
              <Input
                ariaLabel="Надзаголовок"
                value={fields.overline}
                maxLength={100}
                onChange={(overline) => change({ ...fields, overline })}
              />
            </Field>
            <Field label="Заголовок">
              <Input
                ariaLabel="Заголовок"
                value={fields.title}
                maxLength={150}
                onChange={(title) => change({ ...fields, title })}
              />
            </Field>
            <Field label="Подзаголовок" wide>
              <Textarea
                ariaLabel="Подзаголовок"
                value={fields.description}
                rows={3}
                maxLength={500}
                onChange={(description) => change({ ...fields, description })}
              />
            </Field>
            <Field label="Текст кнопки каталога">
              <Input
                ariaLabel="Текст кнопки каталога"
                value={fields.catalog_button_label}
                maxLength={60}
                onChange={(label) => change({ ...fields, catalog_button_label: label })}
              />
            </Field>
            <Field label="Текст кнопки помощи в сборке">
              <Input
                ariaLabel="Текст кнопки помощи в сборке"
                value={fields.support_button_label}
                maxLength={60}
                onChange={(label) => change({ ...fields, support_button_label: label })}
              />
            </Field>
            <Field label="Альтернативный текст картинки">
              <Input
                ariaLabel="Альтернативный текст картинки"
                value={fields.image_alt}
                maxLength={150}
                onChange={(alt) => change({ ...fields, image_alt: alt })}
              />
            </Field>
            <Field label="Подпись на картинке">
              <Input
                ariaLabel="Подпись на картинке"
                value={fields.image_badge}
                maxLength={60}
                onChange={(badge) => change({ ...fields, image_badge: badge })}
              />
            </Field>
          </FieldGrid>

          <HeroStatisticFields
            statistics={fields.statistics}
            onChange={(statistics) => change({ ...fields, statistics })}
          />
        </fieldset>

        <Button className={styles.submit} type="submit" loading={pending}>
          Сохранить первый экран
        </Button>
      </form>
    </Panel>
  );
};

export default HeroContentEditor;
