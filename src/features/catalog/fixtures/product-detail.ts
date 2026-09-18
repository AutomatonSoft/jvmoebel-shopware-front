import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import type {
  ShopProductDetail,
  ShopProductDimensions,
} from "@/features/catalog/model/product-detail";
import type {
  ShopProduct,
  ShopProductSize,
} from "@/features/catalog/model/product-listing";

const sizeLabels = {
  small: "Kompakt",
  medium: "Mittel",
  large: "Groß",
  "extra-large": "Extra groß",
} satisfies Record<ShopProductSize, string>;

const productDimensions: Record<string, ShopProductDimensions> = {
  alba: createDimensions(286, 82, 178),
  aura: createDimensions(228, 80, 102),
  forma: createDimensions(180, 62, 45),
  koto: createDimensions(305, 83, 210),
  linea: createDimensions(160, 58, 42),
  luma: createDimensions(76, 82, 80),
  mira: createDimensions(140, 76, 140),
  nara: createDimensions(74, 79, 77),
  noma: createDimensions(78, 84, 82),
};

function createDimensions(
  width: number,
  height: number,
  length: number,
): ShopProductDimensions {
  return [
    { id: "width", label: "Breite", value: `${width} cm` },
    { id: "height", label: "Höhe", value: `${height} cm` },
    { id: "depth", label: "Tiefe", value: `${length} cm` },
  ];
}

const fallbackDimensions = [] satisfies ShopProductDimensions;

function createProductGallery(product: ShopProduct) {
  const imagesByUrl = new Map<string, ShopProduct["image"]>();

  for (const image of [
    product.image,
    ...shopProductListingMock.products.map((candidate) => candidate.image),
  ]) {
    if (!imagesByUrl.has(image.url)) {
      imagesByUrl.set(image.url, image);
    }
  }

  return Array.from(imagesByUrl.values()) as [
    ShopProduct["image"],
    ...ShopProduct["image"][],
  ];
}

function createProductDetail(product: ShopProduct): ShopProductDetail {
  const colorCount = product.colors.length;

  return {
    ...product,
    accessories: [
      {
        description: "Weiches Wohnaccessoire passend zur Einrichtung",
        id: "boucle-cushion",
        name: "Dekokissen Bouclé",
        price: 49,
      },
      {
        description: "Für die regelmäßige und schonende Reinigung",
        id: "textile-care-kit",
        name: "Textil-Pflegeset",
        price: 29,
      },
      {
        description: "Schützt empfindliche Böden vor Kratzern",
        id: "floor-protector-set",
        name: "Moebelgleiter-Set",
        price: 19,
      },
    ],
    articleNumber: `JV-${product.id.toUpperCase()}-${String(product.featuredRank + 1).padStart(4, "0")}`,
    availability:
      product.badge === "Low stock"
        ? "Nur noch wenige verfügbar"
        : "Auf Bestellung verfügbar",
    colorVariantGroups: [],
    deliveryEstimate:
      product.badge === "Low stock" ? "2–4 Wochen" : "4–8 Wochen",
    deliveryMethod: "Moebelspedition bis zum Wunschort",
    dimensions: productDimensions[product.id] ?? fallbackDimensions,
    gallery: createProductGallery(product),
    isAvailable: true,
    longDescription: `${product.name} verbindet eine klare Formensprache mit dem charakteristischen Material ${product.material}. Das Moebelstück ist für moderne Wohnräume gestaltet und lässt sich durch die verfügbaren Farben und Größen auf das persönliche Einrichtungskonzept abstimmen.`,
    longDescriptionHtml: `<p>${product.name} verbindet eine klare Formensprache mit dem charakteristischen Material ${product.material}. Das Moebelstück ist für moderne Wohnräume gestaltet und lässt sich durch die verfügbaren Farben und Größen auf das persönliche Einrichtungskonzept abstimmen.</p>`,
    services: [
      {
        available: true,
        description: "Wir bauen auf, Sie sparen Zeit",
        id: "assembly",
        name: "Aufbauservice",
        price: 99,
      },
      {
        available: true,
        description: "Extrapflege für Ihr neues Polstermoebel",
        id: "stain-protection",
        name: "Premium-Fleckschutz",
        price: 169,
      },
      {
        available: false,
        description: "Fachgerechte Entsorgung eines Moebelstücks",
        id: "old-furniture-removal",
        name: "Altmoebelmitnahme",
        price: 129,
      },
    ],
    shippingFree: false,
    sizeVariantGroups: [],
    specifications: [
      {
        id: "article-number",
        label: "Artikelnummer",
        value: `JV-${product.id.toUpperCase()}-${String(product.featuredRank + 1).padStart(4, "0")}`,
      },
      { id: "category", label: "Kategorie", value: product.categoryLabel },
      { id: "brand", label: "Marke", value: product.company },
      { id: "material", label: "Material", value: product.material },
      {
        id: "colors",
        label: "Verfügbare Farben",
        value: `${colorCount} ${colorCount === 1 ? "Farbe" : "Farben"}`,
      },
      {
        id: "sizes",
        label: "Verfügbare Größen",
        value: product.sizes.map((size) => sizeLabels[size]).join(", "),
      },
    ],
    variantParentId: product.id,
  };
}

export const shopProductDetailsMock =
  shopProductListingMock.products.map(createProductDetail);
