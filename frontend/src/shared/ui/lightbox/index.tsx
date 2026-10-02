"use client";

import lightGallery from "lightgallery";
import "lightgallery/css/lightgallery.css";
import { useEffect, useEffectEvent, useRef } from "react";

type LightboxProps = {
  images: string[];
  index: number | null;
  onClose: () => void;
};

/** Полноэкранный просмотр фото со стрелками. Открыт с фото index, пока index не null. */
const Lightbox = ({ images, index, onClose }: LightboxProps) => {
  const element = useRef<HTMLDivElement>(null);
  const slides = useEffectEvent(() => images.map((src) => ({ src })));
  const close = useEffectEvent(onClose);

  useEffect(() => {
    const node = element.current;

    if (index === null || !node) {
      return;
    }

    const gallery = lightGallery(node, {
      dynamic: true,
      dynamicEl: slides(),
      download: false,
      hideScrollbar: true,
    });

    node.addEventListener("lgAfterClose", close);
    gallery.openGallery(index);

    return () => {
      node.removeEventListener("lgAfterClose", close);
      gallery.destroy();
    };
  }, [index]);

  return <div ref={element} hidden />;
};

export default Lightbox;
