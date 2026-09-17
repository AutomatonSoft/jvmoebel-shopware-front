import type { ShopProductListingPage } from "@/features/catalog/model/product-listing-page";
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
  listing: ShopProductListingPage | null;
}>;

export type ShopCategoryPageContent = Readonly<
  Omit<ShopCategoryPage, "listing"> & {
    hasProductListing: boolean;
  }
>;
