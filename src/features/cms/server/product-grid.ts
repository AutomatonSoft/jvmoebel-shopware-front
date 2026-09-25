import "server-only";

import { connection } from "next/server";

import type {
  CmsProductGridData,
  CmsProductGridReferenceData,
} from "@/features/cms/contracts/product-grid";
import { getShopwareCmsGridProducts } from "@/integrations/shopware/cms-product-grid";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

type GridInput = CmsProductGridData | CmsProductGridReferenceData;

function getReferences(data: GridInput) {
  return "productReferences" in data ? data.productReferences : data.products;
}

function withoutProducts(data: GridInput): CmsProductGridData {
  return {
    anchorId: data.anchorId,
    currency: "currency" in data ? data.currency : "",
    eyebrow: data.eyebrow,
    layout: data.layout,
    locale: "locale" in data ? data.locale : "",
    products: [],
    title: data.title,
    viewAll: data.viewAll,
  };
}

export async function getLiveCmsProductGrid(
  data: GridInput,
): Promise<CmsProductGridData> {
  if (shouldUseShopwareMocks() && "products" in data) {
    return data;
  }

  const references = getReferences(data);
  if (references.length === 0) {
    return withoutProducts(data);
  }

  await connection();

  try {
    const ids = [...new Set(references.map((product) => product.id))];
    const listing = await getShopwareCmsGridProducts(
      getShopwareRequestSession().client,
      ids,
    );
    const productsById = new Map(
      listing.products.map((product) => [product.id, product]),
    );
    const products = references.flatMap((reference) => {
      const product = productsById.get(reference.id);
      if (!product) {
        console.error("Could not load live CMS product.", {
          productId: reference.id,
          cause: "Product unavailable",
        });
        return [];
      }

      return [
        {
          badge: product.badge,
          description: product.description,
          id: product.id,
          image: product.image,
          name: product.name,
          position: reference.position,
          previousPrice: product.previousPrice,
          rating: product.rating,
          reviewCount: product.reviewCount,
          unitPrice: product.unitPrice,
          url: product.url,
        },
      ];
    });

    return {
      ...withoutProducts(data),
      currency: listing.currency,
      locale: listing.locale,
      products,
    };
  } catch (error) {
    console.error("Could not load live CMS product grid.", {
      cause: error instanceof Error ? error.message : "Unknown error",
    });
    return withoutProducts(data);
  }
}
