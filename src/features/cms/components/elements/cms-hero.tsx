import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { HeroCarousel } from "@/features/cms/components/elements/hero-carousel";
import { parseCmsHeroData } from "@/features/cms/contracts/hero";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsHero({ slot }: CmsSlotComponentProps) {
  const result = parseCmsHeroData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  return <HeroCarousel data={result.data} />;
}
