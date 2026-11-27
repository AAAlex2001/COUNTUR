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
  const { hero, pending, failed, retry, upload, remove } = useHeroImage();
  const [confirming, setConfirming] = useState(false);

  /** Удаляет выбранное изображение после подтверждения. */
  const confirmDelete = async () => {
    if (await remove()) setConfirming(false);
  };

  /** Закрывает подтверждение до начала удаления. */
  const cancelDelete = () => {
    if (!pending) setConfirming(false);
  };

  return (
    <Panel
      title="Картинка первого экрана"
      action={
        <div className={styles.actions}>
          <FileButton accept={IMAGE_TYPES} loading={pending || !hero} onSelect={upload}>
            Загрузить картинку
          </FileButton>
          {hero?.image_url && (
            <Button variant="danger" disabled={pending} onClick={() => setConfirming(true)}>
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
        {hero?.image_url && (
          <Image
            src={hero.image_url}
            alt=""
            fill
            sizes="574px"
            unoptimized
            className={styles.image}
          />
        )}

        {hero && !hero.image_url && (
          <p className={styles.empty}>Картинка ещё не загружена</p>
        )}
        {failed && <Button variant="outline" onClick={retry}>Повторить загрузку</Button>}
      </div>

      <ConfirmModal
        open={confirming}
        title="Удалить картинку первого экрана?"
        text="Изображение будет удалено с главной страницы."
        confirmLabel="Удалить"
        pending={pending}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Panel>
  );
};

export default HeroImageEditor;
