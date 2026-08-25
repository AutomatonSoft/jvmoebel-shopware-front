import {
  findShopProductDetailBySlug,
  type ShopProductDetail,
  type ShopProductDetailMedia,
  type ShopProductDetailOptionGroup,
  type ShopProductDetailPage,
} from "@/lib/shopware/product-detail";
import { shopProductListingMock } from "@/lib/shopware/mocks/product-listing";
import type {
  ShopProduct,
  ShopProductSize,
} from "@/lib/shopware/product-listing";

const sizeLabels = {
  "extra-large": "Extra large",
  large: "Large",
  medium: "Medium",
  small: "Small",
} satisfies Record<ShopProductSize, string>;

function buildGallery(product: ShopProduct) {
  const mediaByUrl = new Map<string, ShopProductDetailMedia>();

  for (const media of [
    product.image,
    ...shopProductListingMock.products.map((listingProduct) =>
      listingProduct.id === product.id ? undefined : listingProduct.image,
    ),
  ]) {
    if (media && !mediaByUrl.has(media.url)) {
      mediaByUrl.set(media.url, media);
    }
  }

  return Array.from(mediaByUrl.values()) as [
    ShopProductDetailMedia,
    ...ShopProductDetailMedia[],
  ];
}

function buildOptionGroups(product: ShopProduct) {
  const groups: ShopProductDetailOptionGroup[] = [];

  if (product.colors.length > 0) {
    groups.push({
      displayType: "swatch",
      id: "colour",
      label: "Colour",
      options: product.colors.map((color) => ({
        available: true,
        id: color.value,
        label: color.label,
        swatch: color.hex,
      })),
      selectedOptionId: product.colors[0].value,
    });
  }

  if (product.id === "alba") {
    groups.push({
      displayType: "button",
      id: "fabric",
      label: "Fabric",
      options: [
        {
          available: true,
          id: "premium-boucle",
          label: "Premium bouclÃ©",
        },
        {
          available: true,
          id: "performance-linen",
          label: "Performance linen",
          priceDifference: 120,
        },
      ],
      selectedOptionId: "premium-boucle",
    });
  }

  if (product.sizes.length > 0) {
    groups.push({
      displayType: "select",
      id: "configuration",
      label: "Configuration",
      options: product.sizes.map((size) => ({
        available: true,
        id: size,
        label: sizeLabels[size],
      })),
      selectedOptionId: product.sizes[0],
    });
  }

  return groups;
}

function buildProductDetail(product: ShopProduct): ShopProductDetail {
  return {
    ...product,
    gallery: buildGallery(product),
    longDescription: `${product.name} combines considered proportions, durable materials and everyday comfort for contemporary interiors.`,
    optionGroups: buildOptionGroups(product),
    productNumber: `JV-${product.id.toUpperCase()}`,
    purchaseNotes: [
      {
        id: "delivery",
        kind: "delivery",
        text: "Ready to ship in 2â€“3 weeks Â· Free room delivery",
      },
      {
        id: "returns",
        kind: "returns",
        text: "30-day returns",
      },
      {
        id: "warranty",
        kind: "warranty",
        text: "5-year frame guarantee",
      },
    ],
    slug: product.id,
  };
}

export const shopProductDetailsMock =
  shopProductListingMock.products.map(buildProductDetail);

export function getShopProductDetailMock(
  slug: string,
): ShopProductDetailPage | undefined {
  const product = findShopProductDetailBySlug(shopProductDetailsMock, slug);

  if (!product) {
    return undefined;
  }

  return {
    currency: shopProductListingMock.currency,
    locale: shopProductListingMock.locale,
    product,
    recommendations: shopProductListingMock.products
      .filter((recommendation) => recommendation.id !== product.id)
      .slice(0, 3),
  };
}
