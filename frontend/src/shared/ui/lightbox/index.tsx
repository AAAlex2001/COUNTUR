"use client";

import lightGallery from "lightgallery";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import { useEffect, useRef } from "react";

type LightboxProps = {
  images: string[];
  index: number | null;
  onClose: () => void;
};

/** Фото на весь экран со стрелками и миниатюрами. Открыт с фото index, пока он не null. */
const Lightbox = ({ images, index, onClose }: LightboxProps) => {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = element.current;

    if (index === null || !node) {
      return;
    }

    const gallery = lightGallery(node, {
      plugins: [lgThumbnail],
      dynamic: true,
      dynamicEl: images.map((src) => ({ src, thumb: src })),
      download: false,
      hideScrollbar: true,
    });

    node.addEventListener("lgAfterClose", onClose);
    gallery.openGallery(index);

    return () => {
      node.removeEventListener("lgAfterClose", onClose);
      gallery.destroy();
    };
  }, [images, index, onClose]);

  return <div ref={element} hidden />;
};

export default Lightbox;
