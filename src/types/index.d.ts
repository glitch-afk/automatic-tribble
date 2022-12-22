export interface NavItem {
  title: string;
  href: string;
  disabled: boolean;
  icon?: any;
}

export type MainNavItem = Pick<NavItem, 'title' | 'href' | 'disabled'>;
