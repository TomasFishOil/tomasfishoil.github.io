import type { NavLink, Social } from "../types";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Prefix a site-absolute path with the configured `base`. */
export const url = (path: string) => base + path;

export const siteName = "tomas palmieri";

export const siteTitle = "Tomas Palmieri";
export const siteTagline = "Game Development Portfolio";

export const defaultThemeColor = "#dbdcd6";

export const links: NavLink[] = [
  { label: "Home", path: "/" },
  { label: "Experience", path: "/experience/" },
  { label: "About Me", path: "/about-me/" },
  { label: "Contact", path: "/contact/" },
].map((l) => ({ ...l, href: url(l.path) }));

export const socials: Social[] = [
  {
    name: "Email",
    handle: "tomaspalmierii5@gmail.com",
    href: "mailto:tomaspalmierii5@gmail.com",
    icon: "lucide:mail",
  },
  {
    name: "LinkedIn",
    handle: "in/tomas-sebastian-palmieri",
    href: "https://www.linkedin.com/in/tomas-sebastian-palmieri/",
    icon: "lucide:linkedin",
  },
];

const trim = (s: string) => s.replace(/\/+$/, "") || "/";

/** True when `href` is the page at `pathname` (home only matches exactly). */
export const isCurrent = (pathname: string, href: string) => {
  const p = trim(pathname);
  const h = trim(href);
  if (h === trim(url("/"))) return p === h;
  return p === h || p.startsWith(h + "/");
};
