import type { ComponentType, FunctionComponent } from "react";

import type { ShopCategoryPage } from "@/features/catalog/model/category-page";
import type { ShopProductListingPage } from "@/features/catalog/model/product-listing-page";
import type { CmsContractResult } from "@/features/cms/contracts/result";
import type { CmsSlot } from "@/features/cms/model/page";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export type CmsPageRenderContext = Readonly<{
  category?: Pick<ShopCategoryPage["category"], "name">;
  categoryListing?: ShopProductListingPage | null;
}>;

export type CmsSlotComponentProps = Readonly<{
  renderContext?: CmsPageRenderContext;
  slot: CmsSlot;
}>;

export type CmsElementProps<T> = Readonly<{
  data: T;
  id: string;
}>;

export type CmsSlotComponent = ComponentType<CmsSlotComponentProps>;

type CmsElementParser<T> = (slot: CmsSlot) => CmsContractResult<T>;

export function createCmsElementRenderer<T>(
  parse: CmsElementParser<T>,
  Element: ComponentType<CmsElementProps<T>>,
): FunctionComponent<CmsSlotComponentProps> {
  return function CmsElementRenderer({ slot }) {
    const result = parse(slot);

    reportCmsContractIssues(slot, result.issues);

    if (!result.data) {
      return null;
    }

    return <Element data={result.data} id={slot.id} />;
  };
}

export function createCmsDataElementRenderer<T>(
  parse: (value: unknown) => CmsContractResult<T>,
  Element: ComponentType<CmsElementProps<T>>,
) {
  return createCmsElementRenderer((slot) => parse(slot.data), Element);
}
