import type { IconProps } from "./types";

export const ArrowLeftIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
