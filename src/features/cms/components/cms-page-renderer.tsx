import { Container } from "@/components/ui/container";
import {
  createCmsDataElementRenderer,
  createCmsElementRenderer,
  type CmsPageRenderContext,
  type CmsSlotComponent,
  type CmsSlotComponentProps,
} from "@/features/cms/components/cms-element";
import { CmsArticleHero } from "@/features/cms/components/elements/cms-article-hero";
import { CmsAuthorFooter } from "@/features/cms/components/elements/cms-author-footer";
import { CmsBenefitStrip } from "@/features/cms/components/elements/cms-benefit-strip";
import { CmsCategoryName } from "@/features/cms/components/elements/cms-category-name";
import { CmsCategoryRail } from "@/features/cms/components/elements/cms-category-rail";
import { CmsChipRail } from "@/features/cms/components/elements/cms-chip-rail";
import { CmsColorWorldPicker } from "@/features/cms/components/elements/cms-color-world-picker";
import { CmsContactForm } from "@/features/cms/components/elements/cms-contact-form";
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
import { parseCmsArticleHeroData } from "@/features/cms/contracts/article-hero";
import { parseCmsAuthorFooterData } from "@/features/cms/contracts/author-footer";
import { parseCmsBenefitStripData } from "@/features/cms/contracts/benefit-strip";
import { parseCmsCategoryRailData } from "@/features/cms/contracts/category-rail";
import { parseCmsChipRailData } from "@/features/cms/contracts/chip-rail";
import { parseCmsColorWorldPickerData } from "@/features/cms/contracts/color-world-picker";
import { parseCmsContactFormData } from "@/features/cms/contracts/contact-form";
import { parseCmsCountdownPromoData } from "@/features/cms/contracts/countdown-promo";
import { parseCmsCrossRoomSectionData } from "@/features/cms/contracts/cross-room-section";
import { parseCmsEditorialTeamGridData } from "@/features/cms/contracts/editorial-team-grid";
import { parseCmsExpertProfileData } from "@/features/cms/contracts/expert-profile";
import { parseCmsExpertQuoteData } from "@/features/cms/contracts/expert-quote";
import { parseCmsExpertTipData } from "@/features/cms/contracts/expert-tip";
import { parseCmsFaqData } from "@/features/cms/contracts/faq";
import { parseCmsGuideHubCardsData } from "@/features/cms/contracts/guide-hub-cards";
import { parseCmsHeroData } from "@/features/cms/contracts/hero";
import { parseCmsHomeEditorialData } from "@/features/cms/contracts/home-editorial";
import { parseCmsImageData } from "@/features/cms/contracts/image";
import { parseCmsInlineProductTeaserData } from "@/features/cms/contracts/inline-product-teaser";
import { parseCmsInstagramStyleData } from "@/features/cms/contracts/instagram-style";
import { parseCmsLookSceneData } from "@/features/cms/contracts/look-scene";
import { parseCmsLoyaltyPromoData } from "@/features/cms/contracts/loyalty-promo";
import { parseCmsNewsletterData } from "@/features/cms/contracts/newsletter";
import { parseCmsOfferRailData } from "@/features/cms/contracts/offer-rail";
import { parseCmsPageHeaderData } from "@/features/cms/contracts/page-header";
import { parseCmsProductGridData } from "@/features/cms/contracts/product-grid";
import { parseCmsPromoBannerData } from "@/features/cms/contracts/promo-banner";
import { parseCmsPromoDealTilesData } from "@/features/cms/contracts/promo-deal-tiles";
import { parseCmsRelatedLookCardsData } from "@/features/cms/contracts/related-look-cards";
import { parseCmsReviewSummaryData } from "@/features/cms/contracts/review-summary";
import { parseCmsRoomGridData } from "@/features/cms/contracts/room-grid";
import { parseCmsShopTheLookData } from "@/features/cms/contracts/shop-the-look";
import { parseCmsSubcategoryLinksData } from "@/features/cms/contracts/subcategory-links";
import { parseCmsTableOfContentsData } from "@/features/cms/contracts/table-of-contents";
import { parseCmsTextData } from "@/features/cms/contracts/text";
import { parseCmsTrendLookGridData } from "@/features/cms/contracts/trend-look-grid";
import { parseCmsTrustRatingData } from "@/features/cms/contracts/trust-rating";
import { parseCmsWhyJvmoebelData } from "@/features/cms/contracts/why-jvmoebel";
import { parseCmsYoutubeVideoData } from "@/features/cms/contracts/youtube-video";
import type { CmsBlock, CmsPage, CmsSection } from "@/features/cms/model/page";
import {
  getCmsBackgroundStyle,
  getCmsVisibilityClassName,
  isPassiveCmsBlock,
} from "@/features/cms/model/layout";
import { reportCmsRenderingIssue } from "@/features/cms/server/report-rendering-issue";
import { cn } from "@/lib/utils";

export type {
  CmsPageRenderContext,
  CmsSlotComponentProps,
} from "@/features/cms/components/cms-element";

function CmsCategoryNameSlot({ renderContext, slot }: CmsSlotComponentProps) {
  const category = renderContext?.category;

  if (!category) {
    reportCmsRenderingIssue({
      code: "rendering-failed",
      message:
        "The category-name element requires category data from its route.",
      slot,
    });
    return null;
  }

  return <CmsCategoryName name={category.name} />;
}

function CmsProductListingSlot({ renderContext, slot }: CmsSlotComponentProps) {
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

  return <CmsProductListing listing={listing} />;
}

const cmsSlotComponents: Record<string, CmsSlotComponent | undefined> = {
  "category-name": CmsCategoryNameSlot,
  "jv-article-hero": createCmsDataElementRenderer(
    parseCmsArticleHeroData,
    CmsArticleHero,
  ),
  "jv-author-footer": createCmsDataElementRenderer(
    parseCmsAuthorFooterData,
    CmsAuthorFooter,
  ),
  "jv-benefit-strip": createCmsDataElementRenderer(
    parseCmsBenefitStripData,
    CmsBenefitStrip,
  ),
  "jv-category-rail": createCmsDataElementRenderer(
    parseCmsCategoryRailData,
    CmsCategoryRail,
  ),
  "jv-chip-rail": createCmsDataElementRenderer(
    parseCmsChipRailData,
    CmsChipRail,
  ),
  "jv-color-world-picker": createCmsDataElementRenderer(
    parseCmsColorWorldPickerData,
    CmsColorWorldPicker,
  ),
  form: createCmsElementRenderer(
    (slot) => parseCmsContactFormData(slot.config),
    CmsContactForm,
  ),
  "jv-countdown-promo": createCmsDataElementRenderer(
    parseCmsCountdownPromoData,
    CmsCountdownPromo,
  ),
  "jv-cross-room-section": createCmsDataElementRenderer(
    parseCmsCrossRoomSectionData,
    CmsCrossRoomSection,
  ),
  "jv-editorial-team-grid": createCmsDataElementRenderer(
    parseCmsEditorialTeamGridData,
    CmsEditorialTeamGrid,
  ),
  "jv-expert-tip": createCmsDataElementRenderer(
    parseCmsExpertTipData,
    CmsExpertTip,
  ),
  "jv-expert-quote": createCmsDataElementRenderer(
    parseCmsExpertQuoteData,
    CmsExpertQuote,
  ),
  "jv-expert-profile": createCmsDataElementRenderer(
    parseCmsExpertProfileData,
    CmsExpertProfile,
  ),
  "jv-faq": createCmsDataElementRenderer(parseCmsFaqData, CmsFaq),
  "jv-guide-hub-cards": createCmsDataElementRenderer(
    parseCmsGuideHubCardsData,
    CmsGuideHubCards,
  ),
  "jv-hero": createCmsDataElementRenderer(parseCmsHeroData, CmsHero),
  "jv-home-editorial": createCmsDataElementRenderer(
    parseCmsHomeEditorialData,
    CmsHomeEditorial,
  ),
  "jv-inline-product-teaser": createCmsDataElementRenderer(
    parseCmsInlineProductTeaserData,
    CmsInlineProductTeaser,
  ),
  "jv-instagram-style": createCmsDataElementRenderer(
    parseCmsInstagramStyleData,
    CmsInstagramStyle,
  ),
  "jv-look-scene": createCmsDataElementRenderer(
    parseCmsLookSceneData,
    CmsLookScene,
  ),
  "jv-loyalty-promo": createCmsDataElementRenderer(
    parseCmsLoyaltyPromoData,
    CmsLoyaltyPromo,
  ),
  "jv-newsletter": createCmsDataElementRenderer(
    parseCmsNewsletterData,
    CmsNewsletter,
  ),
  "jv-offer-rail": createCmsDataElementRenderer(
    parseCmsOfferRailData,
    CmsOfferRail,
  ),
  "jv-page-header": createCmsDataElementRenderer(
    parseCmsPageHeaderData,
    CmsPageHeader,
  ),
  "jv-product-grid": createCmsDataElementRenderer(
    parseCmsProductGridData,
    CmsProductGrid,
  ),
  "jv-promo-banner": createCmsDataElementRenderer(
    parseCmsPromoBannerData,
    CmsPromoBanner,
  ),
  "jv-promo-deal-tiles": createCmsDataElementRenderer(
    parseCmsPromoDealTilesData,
    CmsPromoDealTiles,
  ),
  "jv-related-look-cards": createCmsDataElementRenderer(
    parseCmsRelatedLookCardsData,
    CmsRelatedLookCards,
  ),
  "jv-review-summary": createCmsDataElementRenderer(
    parseCmsReviewSummaryData,
    CmsReviewSummary,
  ),
  "jv-room-grid": createCmsDataElementRenderer(
    parseCmsRoomGridData,
    CmsRoomGrid,
  ),
  "jv-shop-the-look": createCmsDataElementRenderer(
    parseCmsShopTheLookData,
    CmsShopTheLook,
  ),
  "jv-subcategory-links": createCmsDataElementRenderer(
    parseCmsSubcategoryLinksData,
    CmsSubcategoryLinks,
  ),
  "jv-table-of-contents": createCmsDataElementRenderer(
    parseCmsTableOfContentsData,
    CmsTableOfContents,
  ),
  "jv-trend-look-grid": createCmsDataElementRenderer(
    parseCmsTrendLookGridData,
    CmsTrendLookGrid,
  ),
  "jv-trust-rating": createCmsDataElementRenderer(
    parseCmsTrustRatingData,
    CmsTrustRating,
  ),
  "jv-why-jvmoebel": createCmsDataElementRenderer(
    parseCmsWhyJvmoebelData,
    CmsWhyJvmoebel,
  ),
  image: createCmsElementRenderer(parseCmsImageData, CmsImage),
  "product-listing": CmsProductListingSlot,
  "sidebar-filter": CmsSidebarFilter,
  text: createCmsElementRenderer(parseCmsTextData, CmsText),
  "youtube-video": createCmsElementRenderer(
    parseCmsYoutubeVideoData,
    CmsYoutubeVideo,
  ),
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
