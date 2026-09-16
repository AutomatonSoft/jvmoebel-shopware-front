import { ShopCatalog } from "@/features/catalog/components/shop-catalog";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { reportCmsRenderingIssue } from "@/features/cms/server/report-rendering-issue";

export function CmsProductListing({
  renderContext,
  slot,
}: CmsSlotComponentProps) {
  const listing = renderContext?.categoryListing;

  if (!listing) {
    reportCmsRenderingIssue({
      code: "rendering-failed",
      message:
        "The product-listing element requires category listing data from its route.",
      slot,
    });
    return null;
  }

  return <ShopCatalog hideHeader listing={listing} />;
}
