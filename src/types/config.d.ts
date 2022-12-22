import type { MainNavItem } from '.';

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  locale: string;
  links: {
    twitter: string;
    github: string;
  };
}

export interface LandingConfig {
  mainNav: MainNavItem;
}
