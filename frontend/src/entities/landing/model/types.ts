export type Hero = {
  image_url: string | null;
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
