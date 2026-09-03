export type StoreNavigationItem = {
  children: StoreNavigationItem[];
  href: string;
  id: string;
  label: string;
};

export type MainNavigation = StoreNavigationItem[];
