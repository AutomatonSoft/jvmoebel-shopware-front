import {
  findShopProductDetailBySlug,
  type ShopProductDetail,
  type ShopProductDimensions,
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

const productDimensions: Record<string, ShopProductDimensions> = {
  alba: { height: 82, length: 178, unit: "cm", width: 286 },
  aura: { height: 80, length: 102, unit: "cm", width: 228 },
  forma: { height: 62, length: 45, unit: "cm", width: 180 },
  koto: { height: 83, length: 210, unit: "cm", width: 305 },
  linea: { height: 58, length: 42, unit: "cm", width: 160 },
  luma: { height: 82, length: 80, unit: "cm", width: 76 },
  mira: { height: 76, length: 140, unit: "cm", width: 140 },
  nara: { height: 79, length: 77, unit: "cm", width: 74 },
  noma: { height: 84, length: 82, unit: "cm", width: 78 },
};

const fallbackDimensions = {
  height: 0,
  length: 0,
  unit: "cm",
  width: 0,
} satisfies ShopProductDimensions;

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
  const productNumber = `JV-${product.id.toUpperCase()}`;

  return {
    ...product,
    dimensions: productDimensions[product.id] ?? fallbackDimensions,
    gallery: buildGallery(product),
    longDescription: `${product.name} combines considered proportions, durable materials and everyday comfort for contemporary interiors.`,
    optionGroups: buildOptionGroups(product),
    productNumber,
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
    specifications: [
      {
        id: "product-number",
        label: "Product number",
        value: productNumber,
      },
      {
        id: "category",
        label: "Category",
        value: product.categoryLabel,
      },
      {
        id: "manufacturer",
        label: "Manufacturer",
        value: product.company,
      },
      {
        id: "material",
        label: "Material",
        value: product.material,
      },
      {
        id: "colours",
        label: "Available colours",
        value: product.colors.map((color) => color.label).join(", "),
      },
      {
        id: "configurations",
        label: "Available configurations",
        value: product.sizes.map((size) => sizeLabels[size]).join(", "),
      },
    ],
  };
}

function getRecommendationScore(
  product: ShopProduct,
  recommendation: ShopProduct,
) {
  const sharedColors = recommendation.colors.filter((color) =>
    product.colors.some((productColor) => productColor.value === color.value),
  ).length;
  const sharedSizes = recommendation.sizes.filter((size) =>
    product.sizes.includes(size),
  ).length;

  return (
    (recommendation.category === product.category ? 4 : 0) +
    (recommendation.material === product.material ? 2 : 0) +
    sharedColors +
    sharedSizes
  );
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
      .toSorted(
        (first, second) =>
          getRecommendationScore(product, second) -
          getRecommendationScore(product, first),
      )
      .slice(0, 3),
  };
}
