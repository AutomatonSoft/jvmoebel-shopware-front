import type { components } from "@shopware/api-client/store-api-types";

import type { CmsPage } from "@/features/cms/model/page";

type ShopwareCmsPage = components["schemas"]["CmsPage"];

export function mapShopwareCmsPage(page: ShopwareCmsPage): CmsPage {
  return {
    cssClass: page.cssClass,
    id: page.id,
    sections: page.sections.map((section) => ({
      blocks: section.blocks.map((block) => ({
        cssClass: block.cssClass,
        id: block.id,
        marginBottom: block.marginBottom,
        marginLeft: block.marginLeft,
        marginRight: block.marginRight,
        marginTop: block.marginTop,
        position: block.position,
        slots: block.slots.map((slot) => ({
          config: slot.config,
          data: slot.data,
          id: slot.id,
          slot: slot.slot,
          type: slot.type,
        })),
        type: block.type,
      })),
      cssClass: section.cssClass,
      id: section.id,
      position: section.position,
      sizingMode: section.sizingMode,
      type: section.type,
    })),
    type: page.type,
  };
}
