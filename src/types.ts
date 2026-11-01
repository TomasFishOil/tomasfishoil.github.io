export interface Metadata {
  title?: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export interface NavLink {
  label: string;
  path: string;
  href: string;
}

export interface Social {
  name: string;
  handle: string;
  href: string;
  icon: string;
}
