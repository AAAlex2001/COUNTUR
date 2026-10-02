"use client";

import cn from "classnames";
import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/entities/product";
import { MaximizeIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

const MAIN_IMAGE_SIZES = "(min-width: 1440px) 490px, (min-width: 768px) 630px, 100vw";

type GalleryProps = {
  name: string;
  images: ProductImage[];
};

/** Галерея товара: большое фото и миниатюры, которые его переключают. */
const Gallery = ({ name, images }: GalleryProps) => {
  const [active, setActive] = useState(images[0]);

  if (!active) {
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
              className={cn(styles.thumbnail, image.id === active.id && styles.active)}
              aria-label={`Показать фото ${index + 1}`}
              aria-pressed={image.id === active.id}
              onClick={() => setActive(image)}
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
          src={active.url}
          alt={name}
          fill
          sizes={MAIN_IMAGE_SIZES}
          unoptimized
          loading="eager"
          className={styles.image}
        />

        <a
          className={styles.zoom}
          href={active.url}
          target="_blank"
          rel="noreferrer"
          aria-label="Открыть фото в полном размере"
        >
          <MaximizeIcon className={styles.zoomIcon} />
        </a>
      </div>
    </div>
  );
};

export default Gallery;
