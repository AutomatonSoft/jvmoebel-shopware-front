import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { OfferRailCarousel } from "@/features/cms/components/elements/offer-rail-carousel";
import { parseCmsOfferRailData } from "@/features/cms/contracts/offer-rail";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsOfferRail({ slot }: CmsSlotComponentProps) {
  const result = parseCmsOfferRailData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  return <OfferRailCarousel data={result.data} />;
}
