import type { CmsElementProps } from "@/features/cms/components/cms-element";
import { OfferRailCarousel } from "@/features/cms/components/elements/offer-rail-carousel";
import type { CmsOfferRailData } from "@/features/cms/contracts/offer-rail";

export function CmsOfferRail({ data }: CmsElementProps<CmsOfferRailData>) {
  return <OfferRailCarousel data={data} />;
}
