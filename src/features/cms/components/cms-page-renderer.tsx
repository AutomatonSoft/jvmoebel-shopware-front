import type { ComponentType } from "react";

import { Container } from "@/components/ui/container";
import { CmsArticleHero } from "@/features/cms/components/elements/cms-article-hero";
import { CmsAuthorFooter } from "@/features/cms/components/elements/cms-author-footer";
import { CmsBenefitStrip } from "@/features/cms/components/elements/cms-benefit-strip";
import { CmsCategoryRail } from "@/features/cms/components/elements/cms-category-rail";
import { CmsChipRail } from "@/features/cms/components/elements/cms-chip-rail";
import { CmsColorWorldPicker } from "@/features/cms/components/elements/cms-color-world-picker";
import { CmsCountdownPromo } from "@/features/cms/components/elements/cms-countdown-promo";
import { CmsExpertTip } from "@/features/cms/components/elements/cms-expert-tip";
import { CmsExpertQuote } from "@/features/cms/components/elements/cms-expert-quote";
import { CmsExpertProfile } from "@/features/cms/components/elements/cms-expert-profile";
import { CmsFaq } from "@/features/cms/components/elements/cms-faq";
import { CmsGuideHubCards } from "@/features/cms/components/elements/cms-guide-hub-cards";
import { CmsHero } from "@/features/cms/components/elements/cms-hero";
import { CmsHomeEditorial } from "@/features/cms/components/elements/cms-home-editorial";
import { CmsImage } from "@/features/cms/components/elements/cms-image";
import { CmsLookScene } from "@/features/cms/components/elements/cms-look-scene";
import { CmsNewsletter } from "@/features/cms/components/elements/cms-newsletter";
import { CmsOfferRail } from "@/features/cms/components/elements/cms-offer-rail";
import { CmsPageHeader } from "@/features/cms/components/elements/cms-page-header";
import { CmsProductGrid } from "@/features/cms/components/elements/cms-product-grid";
import { CmsPromoBanner } from "@/features/cms/components/elements/cms-promo-banner";
import { CmsPromoDealTiles } from "@/features/cms/components/elements/cms-promo-deal-tiles";
import { CmsRelatedLookCards } from "@/features/cms/components/elements/cms-related-look-cards";
import { CmsRoomGrid } from "@/features/cms/components/elements/cms-room-grid";
import { CmsShopTheLook } from "@/features/cms/components/elements/cms-shop-the-look";
import { CmsTableOfContents } from "@/features/cms/components/elements/cms-table-of-contents";
import { CmsTrendLookGrid } from "@/features/cms/components/elements/cms-trend-look-grid";
import { CmsText } from "@/features/cms/components/elements/cms-text";
import { CmsWhyJvmoebel } from "@/features/cms/components/elements/cms-why-jvmoebel";
import { CmsYoutubeVideo } from "@/features/cms/components/elements/cms-youtube-video";
import type {
  CmsBlock,
  CmsPage,
  CmsSection,
  CmsSlot,
} from "@/features/cms/model/page";
import { reportCmsRenderingIssue } from "@/features/cms/server/report-rendering-issue";

export type CmsSlotComponentProps = {
  slot: CmsSlot;
};

type CmsSlotComponent = ComponentType<CmsSlotComponentProps>;

const cmsSlotComponents: Record<string, CmsSlotComponent | undefined> = {
  "jv-article-hero": CmsArticleHero,
  "jv-author-footer": CmsAuthorFooter,
  "jv-benefit-strip": CmsBenefitStrip,
  "jv-category-rail": CmsCategoryRail,
  "jv-chip-rail": CmsChipRail,
  "jv-color-world-picker": CmsColorWorldPicker,
  "jv-countdown-promo": CmsCountdownPromo,
  "jv-expert-tip": CmsExpertTip,
  "jv-expert-quote": CmsExpertQuote,
  "jv-expert-profile": CmsExpertProfile,
  "jv-faq": CmsFaq,
  "jv-guide-hub-cards": CmsGuideHubCards,
  "jv-hero": CmsHero,
  "jv-home-editorial": CmsHomeEditorial,
  "jv-look-scene": CmsLookScene,
  "jv-newsletter": CmsNewsletter,
  "jv-offer-rail": CmsOfferRail,
  "jv-page-header": CmsPageHeader,
  "jv-product-grid": CmsProductGrid,
  "jv-promo-banner": CmsPromoBanner,
  "jv-promo-deal-tiles": CmsPromoDealTiles,
  "jv-related-look-cards": CmsRelatedLookCards,
  "jv-room-grid": CmsRoomGrid,
  "jv-shop-the-look": CmsShopTheLook,
  "jv-table-of-contents": CmsTableOfContents,
  "jv-trend-look-grid": CmsTrendLookGrid,
  "jv-why-jvmoebel": CmsWhyJvmoebel,
  image: CmsImage,
  text: CmsText,
  "youtube-video": CmsYoutubeVideo,
};

function CmsSlotRenderer({ slot }: CmsSlotComponentProps) {
  const SlotComponent = cmsSlotComponents[slot.type];

  if (SlotComponent) {
    return <SlotComponent slot={slot} />;
  }

  reportCmsRenderingIssue({
    code: "unsupported-element",
    message: "No renderer is registered for this CMS element type.",
    slot,
  });

  if (process.env.NODE_ENV === "development") {
    return (
      <div data-cms-slot={slot.slot} data-cms-slot-type={slot.type}>
        Unsupported CMS element: {slot.type}
      </div>
    );
  }

  return null;
}

function CmsBlockRenderer({ block }: { block: CmsBlock }) {
  return (
    <div
      className={block.cssClass || undefined}
      data-cms-block-id={block.id}
      data-cms-block-type={block.type}
      style={{
        marginBottom: block.marginBottom || undefined,
        marginLeft: block.marginLeft || undefined,
        marginRight: block.marginRight || undefined,
        marginTop: block.marginTop || undefined,
      }}
    >
      {block.slots.map((slot) => (
        <CmsSlotRenderer key={slot.id} slot={slot} />
      ))}
    </div>
  );
}

function CmsSectionRenderer({ section }: { section: CmsSection }) {
  const blocks = [...section.blocks].sort(
    (first, second) => first.position - second.position,
  );
  const content = blocks.map((block) => (
    <CmsBlockRenderer block={block} key={block.id} />
  ));

  if (section.sizingMode === "boxed") {
    return (
      <Container
        as="section"
        className={section.cssClass || undefined}
        data-cms-section-id={section.id}
        data-cms-section-sizing={section.sizingMode}
        data-cms-section-type={section.type}
      >
        {content}
      </Container>
    );
  }

  return (
    <section
      className={section.cssClass || undefined}
      data-cms-section-id={section.id}
      data-cms-section-sizing={section.sizingMode}
      data-cms-section-type={section.type}
    >
      {content}
    </section>
  );
}

export function CmsPageRenderer({ page }: { page: CmsPage }) {
  const sections = [...page.sections].sort(
    (first, second) => first.position - second.position,
  );

  return (
    <div
      className={page.cssClass || undefined}
      data-cms-page-id={page.id}
      data-cms-page-type={page.type}
    >
      {sections.map((section) => (
        <CmsSectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
