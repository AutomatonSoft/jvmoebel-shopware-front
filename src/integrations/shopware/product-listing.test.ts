import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import {
  getShopwareProductListing,
  getShopwareProductListingPage,
} from "@/integrations/shopware/product-listing";

type ShopwareProduct = components["schemas"]["Product"];

describe("getShopwareProductListing", () => {
  test("loads products from the sales-channel root without a CMS request", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const product = {
      calculatedPrice: { listPrice: null, unitPrice: 799 },
      id: "product-id",
      name: "Sessel Nara",
      translated: { description: "Bequemer Sessel", name: "Sessel Nara" },
    } as ShopwareProduct;
    const client = {
      invoke: async (operation: string, request: unknown) => {
        requests.push({ operation, request });

        if (operation === "readContext get /context") {
          return {
            data: {
              currency: { isoCode: "EUR" },
              languageInfo: { localeCode: "de-DE" },
              salesChannel: { navigationCategoryId: "root-category-id" },
            },
          };
        }

        return {
          data: {
            elements: [product],
            total: 1,
          },
        };
      },
    } as unknown as Parameters<typeof getShopwareProductListing>[0];

    const listing = await getShopwareProductListing(client);

    expect(listing?.products).toHaveLength(1);
    expect(requests.map(({ operation }) => operation)).toEqual([
      "readContext get /context",
      "readProductListing post /product-listing/{categoryId}",
    ]);
    expect(requests[1]?.request).toMatchObject({
      body: {
        associations: {
          categories: {},
          cover: { associations: { media: {} } },
          manufacturer: {},
          properties: { associations: { group: {} } },
        },
        includes: {
          category: ["id", "name", "path", "translated"],
          media: ["alt", "translated", "url"],
          product: expect.arrayContaining([
            "calculatedPrice",
            "categories",
            "cover",
            "id",
            "manufacturer",
            "properties",
            "seoUrls",
            "translated",
          ]),
          product_manufacturer: ["id", "name", "translated"],
          product_media: ["media"],
          property_group: ["id", "name", "options", "translated"],
          property_group_option: expect.arrayContaining([
            "colorHexCode",
            "group",
            "groupId",
            "id",
            "name",
            "translated",
          ]),
          seo_url: ["isCanonical", "isDeleted", "routeName", "seoPathInfo"],
        },
        limit: 100,
        page: 1,
      },
      pathParams: { categoryId: "root-category-id" },
    });
  });

  test("loads products from a requested category", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const client = {
      invoke: async (operation: string, request: unknown) => {
        requests.push({ operation, request });

        if (operation === "readContext get /context") {
          return {
            data: {
              currency: { isoCode: "EUR" },
              languageInfo: { localeCode: "de-DE" },
              salesChannel: { navigationCategoryId: "root-category-id" },
            },
          };
        }

        return {
          data: {
            elements: [],
            total: 0,
          },
        };
      },
    } as unknown as Parameters<typeof getShopwareProductListing>[0];

    await getShopwareProductListing(client, "requested-category-id");

    expect(requests[1]?.request).toMatchObject({
      pathParams: { categoryId: "requested-category-id" },
    });
  });

  test("loads exactly one page with twelve products", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const product = {
      calculatedPrice: { listPrice: null, unitPrice: 799 },
      id: "product-id",
      name: "Sessel Nara",
      properties: [
        {
          colorHexCode: "#c96f4a",
          groupId: "color-group-id",
          id: "color-id",
          name: "Terrakotta",
          translated: { colorHexCode: "#c96f4a", name: "Terrakotta" },
        },
      ],
      translated: { name: "Sessel Nara" },
    } as ShopwareProduct;
    const client = {
      invoke: async (operation: string, request: unknown) => {
        requests.push({ operation, request });

        if (operation === "readContext get /context") {
          return {
            data: {
              currency: { isoCode: "EUR" },
              languageInfo: { localeCode: "de-DE" },
              salesChannel: { navigationCategoryId: "root-category-id" },
            },
          };
        }

        return {
          data: {
            aggregations: {
              categoryCounts: {
                buckets: [{ count: 3, key: "category-id" }],
              },
              categoryEntities: {
                entities: [
                  {
                    id: "category-id",
                    name: "Sofas",
                    translated: { name: "Sofas" },
                  },
                  {
                    id: "unavailable-category-id",
                    name: "Betten",
                    translated: { name: "Betten" },
                  },
                ],
              },
              manufacturer: {
                entities: [
                  {
                    id: "manufacturer-id",
                    name: "JVMOEBEL",
                    translated: { name: "JVMOEBEL" },
                  },
                ],
              },
              manufacturerCounts: {
                buckets: [{ count: 9, key: "manufacturer-id" }],
              },
              price: { max: 1200, min: 100 },
              properties: {
                entities: [
                  {
                    id: "property-group-id",
                    name: "Farbe",
                    options: [
                      {
                        groupId: "property-group-id",
                        id: "property-id",
                        name: "Terrakotta",
                        translated: { name: "Terrakotta" },
                      },
                      {
                        groupId: "property-group-id",
                        id: "unavailable-property-id",
                        name: "Blau",
                        translated: { name: "Blau" },
                      },
                    ],
                    translated: { name: "Farbe" },
                  },
                ],
              },
              "propertyCounts_property-group-id": {
                buckets: [{ count: 7, key: "property-id" }],
              },
            },
            elements: [product],
            limit: 12,
            page: 2,
            total: 48,
          },
        };
      },
    } as unknown as Parameters<typeof getShopwareProductListingPage>[0];

    const listing = await getShopwareProductListingPage(client, {
      categoryIds: ["category-id"],
      companyIds: ["manufacturer-id"],
      maximumPrice: 1000,
      minimumPrice: 100,
      page: 2,
      propertyGroups: { "property-group-id": ["property-id"] },
      propertyIds: ["property-id"],
      sort: "price-ascending",
    });

    expect(listing.pagination).toEqual({
      currentPage: 2,
      pageSize: 12,
      totalPages: 4,
      totalProducts: 48,
    });
    expect(listing.products).toHaveLength(1);
    expect(listing.products[0]?.colors).toEqual([
      { hex: "#c96f4a", label: "Terrakotta", value: "color-id" },
    ]);
    expect(listing.filterOptions).toMatchObject({
      attributeGroups: [
        {
          id: "property-group-id",
          options: [
            { count: 7, value: "property-id" },
            { count: 0, value: "unavailable-property-id" },
          ],
        },
      ],
      categories: [
        { count: 3, value: "category-id" },
        { count: 0, value: "unavailable-category-id" },
      ],
      companies: [{ count: 9, value: "manufacturer-id" }],
    });
    expect(requests).toHaveLength(2);
    expect(requests[1]?.request).toMatchObject({
      body: {
        associations: {
          cover: { associations: { media: {} } },
          manufacturer: {},
          properties: {},
          seoUrls: {
            filter: [
              {
                field: "routeName",
                type: "equals",
                value: "frontend.detail.page",
              },
              { field: "isCanonical", type: "equals", value: true },
              { field: "isDeleted", type: "equals", value: false },
            ],
          },
        },
        includes: {
          category: ["id", "name", "translated"],
          product: expect.not.arrayContaining([
            "categories",
            "createdAt",
            "description",
            "releaseDate",
          ]),
          property_group_option: expect.not.arrayContaining(["group"]),
        },
        limit: 12,
        manufacturer: "manufacturer-id",
        "max-price": 1000,
        "min-price": 100,
        order: "price-asc",
        page: 2,
        "post-filter": [
          {
            field: "categories.id",
            type: "equalsAny",
            value: "category-id",
          },
        ],
        properties: "property-id",
      },
      pathParams: { categoryId: "root-category-id" },
    });
    const listingRequest = requests[1]?.request as {
      body: { aggregations: Array<Record<string, unknown>> };
    };
    const categoryCounts = listingRequest.body.aggregations.find(
      (aggregation) => aggregation.name === "categoryCounts",
    );
    const selectedGroupCounts = listingRequest.body.aggregations.find(
      (aggregation) => aggregation.name === "propertyCounts_property-group-id",
    );

    expect(categoryCounts).toMatchObject({
      aggregation: {
        field: "categories.id",
        name: "categoryCounts",
        type: "terms",
      },
      name: "categoryCounts",
      type: "filter",
    });
    expect(selectedGroupCounts).toMatchObject({
      aggregation: {
        field: "properties.id",
        name: "propertyCounts_property-group-id",
        type: "terms",
      },
      name: "propertyCounts_property-group-id",
      type: "filter",
    });
    expect(JSON.stringify(selectedGroupCounts?.filter)).not.toContain(
      "property-id",
    );
  });

  test("loads context and products concurrently for a requested category", async () => {
    let releaseContext: (() => void) | undefined;
    let productListingStarted = false;
    const contextGate = new Promise<void>((resolve) => {
      releaseContext = resolve;
    });
    const client = {
      invoke: async (operation: string) => {
        if (operation === "readContext get /context") {
          await contextGate;

          return {
            data: {
              currency: { isoCode: "EUR" },
              languageInfo: { localeCode: "de-DE" },
              salesChannel: { navigationCategoryId: "root-category-id" },
            },
          };
        }

        productListingStarted = true;

        return {
          data: {
            aggregations: { price: { max: 1200, min: 100 } },
            elements: [],
            limit: 12,
            page: 1,
            total: 0,
          },
        };
      },
    } as unknown as Parameters<typeof getShopwareProductListingPage>[0];

    const listingPromise = getShopwareProductListingPage(
      client,
      {
        categoryIds: [],
        companyIds: [],
        page: 1,
        propertyGroups: {},
        propertyIds: [],
        sort: "featured",
      },
      "requested-category-id",
    );

    expect(productListingStarted).toBe(true);

    releaseContext?.();
    await listingPromise;
  });
});
