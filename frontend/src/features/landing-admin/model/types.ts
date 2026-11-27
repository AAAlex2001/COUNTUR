import type { HeroContent } from "@/entities/landing";

export type HeroContentState = {
  fields: HeroContent | null;
  error: string;
  pending: boolean;
};

export type HeroContentAction =
  | { type: "load/finish"; fields: HeroContent }
  | { type: "load/error"; error: string }
  | { type: "fields/change"; changes: Partial<HeroContent> }
  | { type: "save/start" }
  | { type: "save/success"; fields: HeroContent }
  | { type: "save/error" };

export type HeroTextField = {
  name: keyof Omit<HeroContent, "statistics" | "is_visible" | "description">;
  label: string;
  maxLength: number;
};

export type HeroImageState = {
  imageUrl: string | null;
  loaded: boolean;
  pending: boolean;
};

export type HeroImageAction =
  | { type: "load/finish"; imageUrl: string | null }
  | { type: "upload/start" }
  | { type: "upload/success"; imageUrl: string | null }
  | { type: "upload/error" }
  | { type: "delete/start" }
  | { type: "delete/success" }
  | { type: "delete/error" };

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
