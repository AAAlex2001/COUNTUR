"use client";

import Image from "next/image";
import FileButton from "@/shared/ui/file-button";
import Panel from "@/shared/ui/panel";
import { useHeroImage } from "../../model/use-hero-image";
import styles from "./style.module.scss";

const IMAGE_TYPES = "image/jpeg,image/png,image/webp";

/** Картинка первого экрана главной: показывает текущую и заменяет её новой. */
const HeroImageEditor = () => {
  const { state, upload } = useHeroImage();

  return (
    <Panel
      title="Картинка первого экрана"
      action={
        <FileButton accept={IMAGE_TYPES} loading={state.pending} onSelect={upload}>
          Загрузить картинку
        </FileButton>
      }
    >
      <p className={styles.hint}>
        JPEG, PNG или WebP до 5 МБ. Лучше всего смотрится горизонтальная картинка примерно
        1150 × 830.
      </p>

      <div className={styles.preview}>
        {state.imageUrl && (
          <Image
            src={state.imageUrl}
            alt=""
            fill
            sizes="574px"
            unoptimized
            className={styles.image}
          />
        )}

        {state.loaded && !state.imageUrl && (
          <p className={styles.empty}>Картинка ещё не загружена</p>
        )}
      </div>
    </Panel>
  );
};

export default HeroImageEditor;
