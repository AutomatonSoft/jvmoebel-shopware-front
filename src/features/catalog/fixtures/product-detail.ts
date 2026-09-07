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
        name: "Möbelgleiter-Set",
        price: 19,
      },
    ],
    articleNumber: `JV-${product.id.toUpperCase()}-${String(product.featuredRank + 1).padStart(4, "0")}`,
    availability:
      product.badge === "Low stock"
        ? "Nur noch wenige verfügbar"
        : "Auf Bestellung verfügbar",
    deliveryEstimate:
      product.badge === "Low stock" ? "2–4 Wochen" : "4–8 Wochen",
    deliveryMethod: "Möbelspedition bis zum Wunschort",
    dimensions: productDimensions[product.id] ?? fallbackDimensions,
    gallery: createProductGallery(product),
    isAvailable: true,
    longDescription: `${product.name} verbindet eine klare Formensprache mit dem charakteristischen Material ${product.material}. Das Möbelstück ist für moderne Wohnräume gestaltet und lässt sich durch die verfügbaren Farben und Größen auf das persönliche Einrichtungskonzept abstimmen.`,
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
        description: "Extrapflege für Ihr neues Polstermöbel",
        id: "stain-protection",
        name: "Premium-Fleckschutz",
        price: 169,
      },
      {
        available: false,
        description: "Fachgerechte Entsorgung eines Möbelstücks",
        id: "old-furniture-removal",
        name: "Altmöbelmitnahme",
        price: 129,
      },
    ],
    shippingFree: false,
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
  };
}

export const shopProductDetailsMock =
  shopProductListingMock.products.map(createProductDetail);
