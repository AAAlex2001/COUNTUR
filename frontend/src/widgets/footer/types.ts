type FooterLink = {
  label: string;
  href: string;
  newTab?: boolean;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};
