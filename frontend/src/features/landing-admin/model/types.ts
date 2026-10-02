export type HeroImageState = {
  imageUrl: string | null;
  loaded: boolean;
  pending: boolean;
};

export type HeroImageAction =
  | { type: "load/finish"; imageUrl: string | null }
  | { type: "upload/start" }
  | { type: "upload/success"; imageUrl: string | null }
  | { type: "upload/error" };

export type PromotionFields = {
  label: string;
  title: string;
  text: string;
  button_label: string;
  button_url: string;
  is_visible: boolean;
};

export type PromotionState = {
  fields: PromotionFields;
  imageUrl: string | null;
  pending: boolean;
};

export type PromotionAction =
  | { type: "load/finish"; fields: PromotionFields; imageUrl: string | null }
  | { type: "fields/change"; changes: Partial<PromotionFields> }
  | { type: "request/start" }
  | { type: "request/finish" }
  | { type: "image/change"; imageUrl: string | null };
