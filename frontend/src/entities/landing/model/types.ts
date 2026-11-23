export type Hero = {
  image_url: string | null;
};

export type HeroStatistic = {
  value: string;
  label: string;
};

export type HeroContent = {
  is_visible: boolean;
  overline: string;
  title: string;
  description: string;
  catalog_button_label: string;
  support_button_label: string;
  image_alt: string;
  image_badge: string;
  statistics: HeroStatistic[];
};

export type Promotion = {
  label: string;
  title: string;
  text: string;
  button_label: string;
  button_url: string;
  image_url: string | null;
  is_visible: boolean;
};
