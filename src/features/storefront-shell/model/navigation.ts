export type StoreNavigationItem = {
  childCount?: number;
  children: StoreNavigationItem[];
  href: string;
  id: string;
  label: string;
  type?: "folder" | "link" | "page";
};

export type MainNavigation = StoreNavigationItem[];
