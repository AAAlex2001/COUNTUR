"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/shared/ui/button";
import ConfirmModal from "@/shared/ui/confirm-modal";
import FileButton from "@/shared/ui/file-button";
import Panel from "@/shared/ui/panel";
import { useHeroImage } from "../../model/use-hero-image";
import styles from "./style.module.scss";

const IMAGE_TYPES = "image/jpeg,image/png,image/webp";

/** Картинка первого экрана главной: показывает текущую и заменяет её новой. */
const HeroImageEditor = () => {
  const { state, upload, remove } = useHeroImage();
  const [confirming, setConfirming] = useState(false);

  /** Удаляет выбранное изображение после подтверждения. */
  const confirmDelete = async () => {
    if (await remove()) setConfirming(false);
  };

  /** Закрывает подтверждение до начала удаления. */
  const cancelDelete = () => {
    if (!state.pending) setConfirming(false);
  };

  return (
    <Panel
      title="Картинка первого экрана"
      action={
        <div className={styles.actions}>
          <FileButton accept={IMAGE_TYPES} loading={state.pending || !state.loaded} onSelect={upload}>
            Загрузить картинку
          </FileButton>
          {state.imageUrl && (
            <Button variant="danger" disabled={state.pending} onClick={() => setConfirming(true)}>
              Удалить картинку
            </Button>
          )}
        </div>
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

      <ConfirmModal
        open={confirming}
        title="Удалить картинку первого экрана?"
        text="Изображение будет удалено с главной страницы."
        confirmLabel="Удалить"
        pending={state.pending}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Panel>
  );
};

export default HeroImageEditor;
