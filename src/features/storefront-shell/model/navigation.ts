export type StoreNavigationItem = {
  childCount?: number;
  children: StoreNavigationItem[];
  href: string;
  id: string;
  label: string;
};

export type MainNavigation = StoreNavigationItem[];
