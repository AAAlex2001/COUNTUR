import type { ComponentType } from "react";
import type { IconProps } from "@/shared/ui/icons/types";

export type HeaderNavItem = {
  label: string;
  href: string;
  Icon: ComponentType<IconProps>;
  newTab?: boolean;
};
