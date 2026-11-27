"use client";

import Button from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import Loader from "@/shared/ui/loader";
import Panel from "@/shared/ui/panel";
import { useHeroContent } from "../../model/use-hero-content";
import HeroTextFields from "../hero-text-fields";
import HeroStatisticFields from "../hero-statistic-fields";
import styles from "./style.module.scss";

/** Редактирует тексты, показатели и видимость первого экрана. */
const HeroContentEditor = () => {
  const { fields, saving, failed, retry, change, save } = useHeroContent();

  if (!fields) {
    return (
      <Panel title="Тексты первого экрана">
        {failed ? <Button onClick={retry}>Повторить загрузку</Button> : <Loader />}
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
        <fieldset className={styles.fields} disabled={saving}>
          <Checkbox
            checked={fields.is_visible}
            onChange={(isVisible) => change({ is_visible: isVisible })}
          >
            Показывать первый экран на главной
          </Checkbox>
          <p className={styles.hint}>Очистите поле, чтобы скрыть его текст на сайте.</p>

          <HeroTextFields content={fields} onChange={change} />

          <HeroStatisticFields
            statistics={fields.statistics}
            onChange={(statistics) => change({ statistics })}
          />
        </fieldset>

        <Button className={styles.submit} type="submit" loading={saving}>
          Сохранить первый экран
        </Button>
      </form>
    </Panel>
  );
};

export default HeroContentEditor;
