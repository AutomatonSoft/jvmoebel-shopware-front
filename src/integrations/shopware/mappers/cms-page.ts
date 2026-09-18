import type { components } from "@shopware/api-client/store-api-types";

import type {
  CmsBackgroundMediaMode,
  CmsPage,
  CmsVisibility,
} from "@/features/cms/model/page";

type ShopwareCmsPage = components["schemas"]["CmsPage"];

function mapBackgroundMediaMode(
  mode?: string,
): CmsBackgroundMediaMode | undefined {
  return mode === "auto" || mode === "contain" || mode === "cover"
    ? mode
    : undefined;
}

function mapVisibility(
  visibility?: Readonly<{
    desktop?: boolean;
    mobile?: boolean;
    tablet?: boolean;
  }>,
): CmsVisibility | undefined {
  return visibility
    ? {
        desktop: visibility.desktop,
        mobile: visibility.mobile,
        tablet: visibility.tablet,
      }
    : undefined;
}

export function mapShopwareCmsPage(page: ShopwareCmsPage): CmsPage {
  return {
    backgroundColor: page.config?.backgroundColor,
    cssClass: page.cssClass,
    id: page.id,
    sections: page.sections.map((section) => ({
      blocks: section.blocks.map((block) => ({
        backgroundColor: block.backgroundColor,
        backgroundMediaMode: mapBackgroundMediaMode(block.backgroundMediaMode),
        backgroundMediaUrl: block.backgroundMedia?.url,
        cssClass: block.cssClass,
        id: block.id,
        marginBottom: block.marginBottom,
        marginLeft: block.marginLeft,
        marginRight: block.marginRight,
        marginTop: block.marginTop,
        position: block.position,
        sectionPosition: block.sectionPosition,
        slots: block.slots.map((slot) => ({
          config: slot.config,
          data: slot.data,
          id: slot.id,
          slot: slot.slot,
          type: slot.type,
        })),
        type: block.type,
        visibility: mapVisibility(block.visibility),
      })),
      backgroundColor: section.backgroundColor,
      backgroundMediaMode: mapBackgroundMediaMode(section.backgroundMediaMode),
      backgroundMediaUrl: section.backgroundMedia?.url,
      cssClass: section.cssClass,
      id: section.id,
      mobileBehavior: section.mobileBehavior,
      position: section.position,
      sizingMode: section.sizingMode,
      type: section.type,
      visibility: mapVisibility(section.visibility),
    })),
    type: page.type,
  };
}
