import type { components } from "@shopware/api-client/store-api-types";

import type {
  CmsBackgroundMediaMode,
  CmsPage,
  CmsVisibility,
} from "@/features/cms/model/page";

type ShopwareCmsPage = components["schemas"]["CmsPage"];

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function mapSlotData(type: string, value: unknown): unknown {
  if (type === "product-listing") {
    return undefined;
  }

  if (type !== "jv-product-grid") {
    return value;
  }

  const data = getRecord(value);
  if (!data) {
    return undefined;
  }

  const products = Array.isArray(data.products)
    ? data.products.map((product, index) => [String(index), product] as const)
    : Object.entries(getRecord(data.products) ?? {});
  const productReferences = products.map(([, value], index) => {
    const product = getRecord(value);
    const id = product?.id;
    return {
      id: typeof id === "string" ? id : undefined,
      position:
        typeof product?.position === "number" &&
        Number.isFinite(product.position)
          ? product.position
          : index,
    };
  });
  const viewAll = getRecord(data.viewAll);

  return {
    anchorId: typeof data.anchorId === "string" ? data.anchorId : undefined,
    eyebrow: typeof data.eyebrow === "string" ? data.eyebrow : undefined,
    layout: typeof data.layout === "string" ? data.layout : undefined,
    productReferences,
    title: typeof data.title === "string" ? data.title : undefined,
    viewAll: viewAll
      ? {
          label: typeof viewAll.label === "string" ? viewAll.label : undefined,
          url: typeof viewAll.url === "string" ? viewAll.url : undefined,
        }
      : undefined,
  };
}

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
          data: mapSlotData(slot.type, slot.data),
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
