"use client";

import cn from "classnames";
import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/entities/product";
import IconButton from "@/shared/ui/icon-button";
import { MaximizeIcon } from "@/shared/ui/icons";
import Lightbox from "@/shared/ui/lightbox";
import styles from "./style.module.scss";

const MAIN_IMAGE_SIZES = "(min-width: 1440px) 490px, (min-width: 768px) 630px, 100vw";

type GalleryProps = {
  name: string;
  images: ProductImage[];
};

/** Галерея товара: большое фото, миниатюры, которые его переключают, и просмотр на весь экран. */
const Gallery = ({ name, images }: GalleryProps) => {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState<number | null>(null);

  const current = images[active];

  if (!current) {
    return <div className={styles.main} />;
  }

  return (
    <div className={styles.gallery}>
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={cn(styles.thumbnail, index === active && styles.active)}
              aria-label={`Показать фото ${index + 1}`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="76px"
                unoptimized
                className={styles.image}
              />
            </button>
          ))}
        </div>
      )}

      <div className={styles.main}>
        <Image
          src={current.url}
          alt={name}
          fill
          sizes={MAIN_IMAGE_SIZES}
          unoptimized
          loading="eager"
          className={styles.image}
        />

        <IconButton
          tone="outline"
          className={styles.zoom}
          ariaLabel="Открыть фото на весь экран"
          onClick={() => setZoomed(active)}
        >
          <MaximizeIcon />
        </IconButton>
      </div>

      <Lightbox
        images={images.map((image) => image.url)}
        index={zoomed}
        onClose={() => setZoomed(null)}
      />
    </div>
  );
};

export default Gallery;
