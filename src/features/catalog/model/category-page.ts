import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import type { CmsPage } from "@/features/cms/model/page";
import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";

export type CategoryBreadcrumb = Readonly<{
  href: string;
  id: string;
  label: string;
}>;

export type ShopCategoryPage = Readonly<{
  breadcrumbs: readonly CategoryBreadcrumb[];
  category: Readonly<{
    canonicalPath: string;
    description: string;
    id: string;
    metaDescription?: string;
    metaTitle?: string;
    name: string;
  }>;
  children: readonly StoreNavigationItem[];
  cmsPage: CmsPage | null;
  listing: ShopProductListing | null;
}>;
