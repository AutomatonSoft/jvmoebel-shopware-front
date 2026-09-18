import type { CmsElementProps } from "@/features/cms/components/cms-element";
import { HeroCarousel } from "@/features/cms/components/elements/hero-carousel";
import type { CmsHeroData } from "@/features/cms/contracts/hero";

export function CmsHero({ data }: CmsElementProps<CmsHeroData>) {
  return <HeroCarousel data={data} />;
}
