import { CategoryPageLoading } from "@/features/catalog/components/category-page-loading";
import { ProductDetailLoading } from "@/features/catalog/components/product-detail-loading";
import { CmsLandingPageLoading } from "@/features/cms/components/cms-landing-page-loading";

type StorefrontPageKind = "category" | "landing-page" | "product";

export function StorefrontPageLoading({ kind }: { kind: StorefrontPageKind }) {
  if (kind === "category") {
    return <CategoryPageLoading />;
  }

  if (kind === "product") {
    return <ProductDetailLoading />;
  }

  return <CmsLandingPageLoading />;
}
