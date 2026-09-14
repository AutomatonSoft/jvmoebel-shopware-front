export type StoreNavigationItem = {
  childCount?: number;
  children: StoreNavigationItem[];
  href: string;
  id: string;
  label: string;
  type?: "folder" | "link" | "page";
};

export type MainNavigation = StoreNavigationItem[];

const shopwareCategoryIdPattern = /^[0-9a-f]{32}$/i;

export function isShopwareCategoryId(value: string) {
  return shopwareCategoryIdPattern.test(value);
}

export function shouldLoadNavigationChildren(item: StoreNavigationItem) {
  if (item.type === "link") {
    return false;
  }

  if ((item.childCount ?? 0) > 0 || item.children.length > 0) {
    return true;
  }

  const hasInternalHref =
    item.href.startsWith("/") && !item.href.startsWith("//");

  return (
    item.childCount === undefined &&
    hasInternalHref &&
    isShopwareCategoryId(item.id)
  );
}
