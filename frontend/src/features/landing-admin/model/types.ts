import type { HeroContent, Promotion } from "@/entities/landing";

export type HeroTextField = {
  name: keyof Omit<HeroContent, "statistics" | "is_visible">;
  label: string;
  maxLength: number;
  type?: "textarea";
};

export type PromotionFields = Omit<Promotion, "image_url">;
