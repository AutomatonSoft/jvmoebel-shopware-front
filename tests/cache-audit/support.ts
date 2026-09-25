import type { ShopwareClient } from "../../src/integrations/shopware/client";

export function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

export async function turn() {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

export const context = {
  currency: { isoCode: "EUR" },
  languageInfo: { localeCode: "de-DE" },
  salesChannel: { navigationCategoryId: "root" },
};

export function rawProduct(id: string, price = 129) {
  return {
    id,
    name: `Live ${id}`,
    url: `/live/${id}`,
    translated: { name: `Live ${id}`, description: "Live description" },
    calculatedPrice: { unitPrice: price, listPrice: { price: price + 50 } },
    cover: { media: { url: "https://example.test/live.webp", alt: "Live" } },
    seoUrls: [
      {
        routeName: "frontend.detail.page",
        isCanonical: true,
        isDeleted: false,
        seoPathInfo: `live/${id}`,
      },
    ],
    available: true,
  };
}

export type Invocation = {
  operation: string;
  options: Record<string, unknown>;
};

export function fakeClient(
  handler: (call: Invocation) => unknown | Promise<unknown>,
) {
  const calls: Invocation[] = [];
  const client = {
    invoke: async (
      operation: string,
      options: Record<string, unknown> = {},
    ) => {
      const call = { operation, options };
      calls.push(call);
      return { data: await handler(call), status: 200 };
    },
  } as unknown as ShopwareClient;
  return { client, calls };
}

export function rawCategory(id = "category", type = "page", path = "|root|") {
  return {
    id,
    name: "Audit category",
    translated: {
      name: "Audit category",
      metaTitle: "Audit title",
      metaDescription: "Audit description",
    },
    type,
    path,
    seoUrl: "/audit-category",
    cmsPage: null,
  };
}

export function rawCmsPage() {
  return {
    id: "cms-audit",
    type: "landingpage",
    sections: [
      {
        id: "section",
        type: "default",
        position: 0,
        blocks: [
          {
            id: "block",
            type: "jv-product-grid",
            position: 0,
            slots: [
              {
                id: "grid",
                slot: "content",
                type: "jv-product-grid",
                config: {
                  title: { value: "Editorial title", source: "static" },
                },
                data: {
                  title: "Editorial title",
                  currency: "EUR",
                  locale: "de-DE",
                  products: [rawProduct("cms-product", 918273)],
                },
              },
              {
                id: "text",
                slot: "text",
                type: "text",
                config: {
                  content: { value: "Editorial content", source: "static" },
                },
                data: { content: "Editorial content" },
              },
            ],
          },
        ],
      },
    ],
  };
}
