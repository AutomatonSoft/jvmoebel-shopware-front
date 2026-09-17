import type { ComponentType } from "react";

import { Container } from "@/components/ui/container";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import { CmsArticleHero } from "@/features/cms/components/elements/cms-article-hero";
import { CmsAuthorFooter } from "@/features/cms/components/elements/cms-author-footer";
import { CmsBenefitStrip } from "@/features/cms/components/elements/cms-benefit-strip";
import { CmsCategoryRail } from "@/features/cms/components/elements/cms-category-rail";
import { CmsChipRail } from "@/features/cms/components/elements/cms-chip-rail";
import { CmsColorWorldPicker } from "@/features/cms/components/elements/cms-color-world-picker";
import { CmsCountdownPromo } from "@/features/cms/components/elements/cms-countdown-promo";
import { CmsCrossRoomSection } from "@/features/cms/components/elements/cms-cross-room-section";
import { CmsEditorialTeamGrid } from "@/features/cms/components/elements/cms-editorial-team-grid";
import { CmsExpertTip } from "@/features/cms/components/elements/cms-expert-tip";
import { CmsExpertQuote } from "@/features/cms/components/elements/cms-expert-quote";
import { CmsExpertProfile } from "@/features/cms/components/elements/cms-expert-profile";
import { CmsFaq } from "@/features/cms/components/elements/cms-faq";
import { CmsGuideHubCards } from "@/features/cms/components/elements/cms-guide-hub-cards";
import { CmsHero } from "@/features/cms/components/elements/cms-hero";
import { CmsHomeEditorial } from "@/features/cms/components/elements/cms-home-editorial";
import { CmsImage } from "@/features/cms/components/elements/cms-image";
import { CmsInlineProductTeaser } from "@/features/cms/components/elements/cms-inline-product-teaser";
import { CmsInstagramStyle } from "@/features/cms/components/elements/cms-instagram-style";
import { CmsLookScene } from "@/features/cms/components/elements/cms-look-scene";
import { CmsLoyaltyPromo } from "@/features/cms/components/elements/cms-loyalty-promo";
import { CmsNewsletter } from "@/features/cms/components/elements/cms-newsletter";
import { CmsOfferRail } from "@/features/cms/components/elements/cms-offer-rail";
import { CmsPageHeader } from "@/features/cms/components/elements/cms-page-header";
import { CmsProductGrid } from "@/features/cms/components/elements/cms-product-grid";
import { CmsProductListing } from "@/features/cms/components/elements/cms-product-listing";
import { CmsPromoBanner } from "@/features/cms/components/elements/cms-promo-banner";
import { CmsPromoDealTiles } from "@/features/cms/components/elements/cms-promo-deal-tiles";
import { CmsRelatedLookCards } from "@/features/cms/components/elements/cms-related-look-cards";
import { CmsReviewSummary } from "@/features/cms/components/elements/cms-review-summary";
import { CmsRoomGrid } from "@/features/cms/components/elements/cms-room-grid";
import { CmsShopTheLook } from "@/features/cms/components/elements/cms-shop-the-look";
import { CmsSidebarFilter } from "@/features/cms/components/elements/cms-sidebar-filter";
import { CmsSubcategoryLinks } from "@/features/cms/components/elements/cms-subcategory-links";
import { CmsTableOfContents } from "@/features/cms/components/elements/cms-table-of-contents";
import { CmsTrendLookGrid } from "@/features/cms/components/elements/cms-trend-look-grid";
import { CmsTrustRating } from "@/features/cms/components/elements/cms-trust-rating";
import { CmsText } from "@/features/cms/components/elements/cms-text";
import { CmsWhyJvmoebel } from "@/features/cms/components/elements/cms-why-jvmoebel";
import { CmsYoutubeVideo } from "@/features/cms/components/elements/cms-youtube-video";
import type {
  CmsBlock,
  CmsPage,
  CmsSection,
  CmsSlot,
} from "@/features/cms/model/page";
import {
  getCmsBackgroundStyle,
  getCmsVisibilityClassName,
  isPassiveCmsBlock,
} from "@/features/cms/model/layout";
import { reportCmsRenderingIssue } from "@/features/cms/server/report-rendering-issue";
import { cn } from "@/lib/utils";

export type CmsSlotComponentProps = {
  renderContext?: CmsPageRenderContext;
  slot: CmsSlot;
};

export type CmsPageRenderContext = Readonly<{
  categoryListing?: ShopProductListing | null;
}>;

type CmsSlotComponent = ComponentType<CmsSlotComponentProps>;

const cmsSlotComponents: Record<string, CmsSlotComponent | undefined> = {
  "jv-article-hero": CmsArticleHero,
  "jv-author-footer": CmsAuthorFooter,
  "jv-benefit-strip": CmsBenefitStrip,
  "jv-category-rail": CmsCategoryRail,
  "jv-chip-rail": CmsChipRail,
  "jv-color-world-picker": CmsColorWorldPicker,
  "jv-countdown-promo": CmsCountdownPromo,
  "jv-cross-room-section": CmsCrossRoomSection,
  "jv-editorial-team-grid": CmsEditorialTeamGrid,
  "jv-expert-tip": CmsExpertTip,
  "jv-expert-quote": CmsExpertQuote,
  "jv-expert-profile": CmsExpertProfile,
  "jv-faq": CmsFaq,
  "jv-guide-hub-cards": CmsGuideHubCards,
  "jv-hero": CmsHero,
  "jv-home-editorial": CmsHomeEditorial,
  "jv-inline-product-teaser": CmsInlineProductTeaser,
  "jv-instagram-style": CmsInstagramStyle,
  "jv-look-scene": CmsLookScene,
  "jv-loyalty-promo": CmsLoyaltyPromo,
  "jv-newsletter": CmsNewsletter,
  "jv-offer-rail": CmsOfferRail,
  "jv-page-header": CmsPageHeader,
  "jv-product-grid": CmsProductGrid,
  "jv-promo-banner": CmsPromoBanner,
  "jv-promo-deal-tiles": CmsPromoDealTiles,
  "jv-related-look-cards": CmsRelatedLookCards,
  "jv-review-summary": CmsReviewSummary,
  "jv-room-grid": CmsRoomGrid,
  "jv-shop-the-look": CmsShopTheLook,
  "jv-subcategory-links": CmsSubcategoryLinks,
  "jv-table-of-contents": CmsTableOfContents,
  "jv-trend-look-grid": CmsTrendLookGrid,
  "jv-trust-rating": CmsTrustRating,
  "jv-why-jvmoebel": CmsWhyJvmoebel,
  image: CmsImage,
  "product-listing": CmsProductListing,
  "sidebar-filter": CmsSidebarFilter,
  text: CmsText,
  "youtube-video": CmsYoutubeVideo,
};

function CmsSlotRenderer({ renderContext, slot }: CmsSlotComponentProps) {
  const SlotComponent = cmsSlotComponents[slot.type];

  if (SlotComponent) {
    return <SlotComponent renderContext={renderContext} slot={slot} />;
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

function CmsBlockRenderer({
  block,
  renderContext,
}: {
  block: CmsBlock;
  renderContext?: CmsPageRenderContext;
}) {
  return (
    <div
      className={cn(
        block.cssClass,
        getCmsVisibilityClassName(block.visibility),
      )}
      data-cms-block-id={block.id}
      data-cms-block-position={block.sectionPosition}
      data-cms-block-type={block.type}
      style={{
        ...getCmsBackgroundStyle(block),
        marginBottom: block.marginBottom || undefined,
        marginLeft: block.marginLeft || undefined,
        marginRight: block.marginRight || undefined,
        marginTop: block.marginTop || undefined,
      }}
    >
      {block.slots.map((slot) => (
        <CmsSlotRenderer
          key={slot.id}
          renderContext={renderContext}
          slot={slot}
        />
      ))}
    </div>
  );
}

function CmsSectionRenderer({
  renderContext,
  section,
}: {
  renderContext?: CmsPageRenderContext;
  section: CmsSection;
}) {
  const blocks = [...section.blocks].sort(
    (first, second) => first.position - second.position,
  );
  const renderBlocks = (items: readonly CmsBlock[]) =>
    items.map((block) => (
      <CmsBlockRenderer
        block={block}
        key={block.id}
        renderContext={renderContext}
      />
    ));
  const sidebarBlocks = blocks.filter(
    (block) => block.sectionPosition === "sidebar" && !isPassiveCmsBlock(block),
  );
  const mainBlocks = blocks.filter(
    (block) => block.sectionPosition !== "sidebar",
  );
  const content =
    section.type === "sidebar" && sidebarBlocks.length > 0 ? (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-12">
        <aside
          className={cn(
            "min-w-0",
            section.mobileBehavior === "hidden" && "max-lg:hidden",
          )}
        >
          {renderBlocks(sidebarBlocks)}
        </aside>
        <div className="min-w-0">{renderBlocks(mainBlocks)}</div>
      </div>
    ) : (
      renderBlocks(section.type === "sidebar" ? mainBlocks : blocks)
    );
  const layoutContent =
    section.sizingMode === "boxed" ? <Container>{content}</Container> : content;

  return (
    <section
      className={cn(
        section.cssClass,
        getCmsVisibilityClassName(section.visibility),
      )}
      data-cms-section-id={section.id}
      data-cms-section-mobile-behavior={section.mobileBehavior}
      data-cms-section-position={section.position}
      data-cms-section-sizing={section.sizingMode}
      data-cms-section-type={section.type}
      style={getCmsBackgroundStyle(section)}
    >
      {layoutContent}
    </section>
  );
}

export function CmsPageRenderer({
  page,
  renderContext,
}: {
  page: CmsPage;
  renderContext?: CmsPageRenderContext;
}) {
  const sections = [...page.sections].sort(
    (first, second) => first.position - second.position,
  );

  return (
    <div
      className={page.cssClass || undefined}
      data-cms-page-id={page.id}
      data-cms-page-type={page.type}
      style={{ backgroundColor: page.backgroundColor || undefined }}
    >
      {sections.map((section) => (
        <CmsSectionRenderer
          key={section.id}
          renderContext={renderContext}
          section={section}
        />
      ))}
    </div>
  );
}
