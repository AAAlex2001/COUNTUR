"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import type { ReactNode } from "react";
import IconButton from "@/shared/ui/icon-button";
import { ArrowRightIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

const SLIDER_OPTIONS = {
  slides: { perView: 1.2, spacing: 12 },
  breakpoints: {
    "(min-width: 768px)": { slides: { perView: 2.4, spacing: 16 } },
    "(min-width: 1440px)": { slides: { perView: 4, spacing: 16 } },
  },
};

type SliderProps = {
  slides: ReactNode[];
};

/** Слайдер карточек: листается свайпом и кнопками «назад» и «вперёд». */
const Slider = ({ slides }: SliderProps) => {
  const [track, slider] = useKeenSlider<HTMLDivElement>(SLIDER_OPTIONS);

  return (
    <div className={styles.slider}>
      <div ref={track} className="keen-slider">
        {slides.map((slide, index) => (
          <div className="keen-slider__slide" key={index}>
            {slide}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <IconButton tone="outline" ariaLabel="Назад" onClick={() => slider.current?.prev()}>
          <ArrowRightIcon className={styles.back} />
        </IconButton>

        <IconButton tone="outline" ariaLabel="Вперёд" onClick={() => slider.current?.next()}>
          <ArrowRightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Slider;
