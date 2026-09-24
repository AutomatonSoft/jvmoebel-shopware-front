import { expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import { mapShopwareProductListingPage } from "@/integrations/shopware/mappers/product-listing-page";

test("keeps selected property filters when an empty listing has no facets", () => {
  const response = {
    elements: [],
    limit: 12,
    page: 1,
    total: 0,
  } as unknown as components["schemas"]["ProductListingResult"];

  const listing = mapShopwareProductListingPage(
    response,
    {
      categoryIds: [],
      companyIds: [],
      page: 1,
      propertyGroups: { color: ["beige"] },
      propertyIds: ["beige"],
      sort: "featured",
    },
    "EUR",
    "de-DE",
  );

  expect(listing.filters.attributes).toEqual({ color: ["beige"] });
  expect(listing.pagination.totalProducts).toBe(0);
});
