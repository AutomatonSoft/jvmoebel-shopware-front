import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import type { CmsBlock, CmsPage } from "@/features/cms/model/page";

function createCmsBlock(
  type: string,
  position: number,
  data: unknown,
): CmsBlock {
  return {
    id: `mock-offers-${type}-block`,
    position,
    slots: [
      {
        data,
        id: `mock-offers-${type}-slot`,
        slot: "content",
        type,
      },
    ],
    type,
  };
}

const selectedProductIds = [
  "alba",
  "noma",
  "forma",
  "mira",
  "aura",
  "luma",
  "koto",
  "linea",
] as const;

const selectedProducts = selectedProductIds.map((productId, position) => {
  const product = shopProductListingMock.products.find(
    (candidate) => candidate.id === productId,
  );

  if (!product) {
    throw new Error(`Missing mock offer product ${productId}.`);
  }

  return {
    badge: product.badge,
    calculatedPrice: {
      listPrice: product.previousPrice
        ? { price: product.previousPrice }
        : undefined,
      unitPrice: product.unitPrice,
    },
    cover: { media: product.image },
    id: product.id,
    position,
    ratingAverage: product.rating,
    reviewCount: product.reviewCount,
    translated: {
      description: product.description,
      name: product.name,
    },
    url: product.url,
  };
});

const categories = [
  ["garden-leisure", "Garten & Freizeit", "/images/main/hero-editorial.webp"],
  ["tables", "Tische", "/images/main/dining-room.webp"],
  ["sofas", "Sofas & Couches", "/images/main/hero-living.webp"],
  ["beds", "Betten", "/images/main/bedroom.webp"],
  ["chairs", "Stühle", "/images/main/lounge-chair.webp"],
  ["storage", "Schränke", "/images/main/media-console.webp"],
  ["lamps", "Lampen", "/images/main/bedroom.webp"],
  ["shelves", "Regale", "/images/main/media-console.webp"],
  ["armchairs", "Sessel", "/images/main/lounge-chair.webp"],
  ["sideboards", "Sideboards", "/images/main/media-console.webp"],
  ["dressers", "Kommoden", "/images/main/dining-room.webp"],
  ["tv-furniture", "TV-Möbel", "/images/main/media-console.webp"],
  ["bathroom-furniture", "Badmöbel", "/images/main/bedroom.webp"],
  ["rugs", "Teppiche", "/images/main/hero-editorial.webp"],
  ["textiles", "Textilien", "/images/main/bedroom.webp"],
  ["accessories", "Accessoires", "/images/main/dining-room.webp"],
].map(([id, label, imageUrl], position) => ({
  id,
  image: { alt: "", url: imageUrl },
  label,
  position,
  url: `/moebel-sortiment?category=${encodeURIComponent(id)}&categoryLabel=${encodeURIComponent(label)}`,
}));

export const discountOffersCmsPageMock: CmsPage = {
  id: "mock-discount-offers-page",
  sections: [
    {
      blocks: [
        createCmsBlock("jv-page-header", 0, {
          description:
            "Entdecke reduzierte Möbel, Wohnaccessoires und ausgewählte Bestseller zum Vorteilspreis.",
          eyebrow: "Preisvorteile für dein Zuhause",
          title: "Sale im Überblick",
        }),
        createCmsBlock("jv-hero", 1, {
          ariaLabel: "JVMöbel Sale",
          autoplay: false,
          headingLevel: "h2",
          slides: [
            {
              description:
                "Entdecke Sofas, Sessel, Tische und Stauraummöbel mit direktem Preisvorteil.",
              eyebrow: "JVMöbel Sale",
              id: "sale-overview",
              image: {
                alt: "Helles Wohnzimmer mit modularer Couch, Loungesessel und Couchtisch",
                url: "/images/offers/sale-living-room.webp",
              },
              layout: "featured",
              position: 0,
              primaryLink: {
                label: "Sale entdecken",
                size: "large",
                url: "#sale-products",
              },
              promotion: { value: "Bis zu 35 %" },
              title: "Ausgewählte Möbel zum Vorteilspreis",
            },
          ],
        }),
        createCmsBlock("jv-category-rail", 2, {
          categories,
          layout: "grid",
          title: "Alle Angebote nach Kategorien",
          viewAll: {
            label: "Alle Deals entdecken",
            url: "/moebel-sortiment",
          },
        }),
        createCmsBlock("jv-product-grid", 3, {
          anchorId: "sale-products",
          currency: shopProductListingMock.currency,
          eyebrow: "Nur solange der Vorrat reicht",
          layout: "rail",
          locale: shopProductListingMock.locale,
          products: selectedProducts,
          title: "Unsere beliebtesten Produkte im Sale",
          viewAll: {
            label: "Jetzt entdecken",
            url: "/moebel-sortiment",
          },
        }),
        createCmsBlock("jv-promo-banner", 4, {
          contentPosition: "right",
          description:
            "Wir helfen dir, das passende Möbel und die richtige Ausführung für deinen Raum auszuwählen.",
          eyebrow: "Persönlich geplant",
          image: {
            alt: "Einrichtungstisch mit Stoff-, Holz- und Materialmustern",
            url: "/images/offers/design-consultation.webp",
          },
          link: {
            label: "Beratung anfragen",
            size: "large",
            url: "mailto:info@jvmoebel.de?subject=Einrichtungsberatung",
          },
          title: "Unsicher bei Material oder Maß?",
        }),
        createCmsBlock("jv-benefit-strip", 5, {
          items: [
            {
              description: "Ausgewählte Möbel mit transparentem Preisvorteil.",
              icon: "price",
              id: "fair-prices",
              position: 0,
              title: "Hohe Qualität zu fairen Preisen",
            },
            {
              description:
                "In Ruhe entscheiden und unkompliziert zurücksenden.",
              icon: "returns",
              id: "returns",
              position: 1,
              title: "30 Tage Rückgaberecht",
            },
            {
              description: "Große Möbel liefern wir bequem bis zum Wunschort.",
              icon: "delivery",
              id: "delivery",
              position: 2,
              title: "Möbelspedition und Aufbauservice",
            },
          ],
        }),
        createCmsBlock("jv-faq", 6, {
          description:
            "Hier findest du die wichtigsten Informationen zu Aktionen, Codes und reduzierten Artikeln.",
          eyebrow: "Gut zu wissen",
          items: [
            {
              answer:
                "Lege die gewünschten Produkte in den Warenkorb und gib den Aktionscode im vorgesehenen Feld ein. Der gültige Nachlass wird direkt in der Bestellübersicht angezeigt.",
              id: "redeem-code",
              position: 0,
              question: "Wie kann ich einen JVMöbel Rabattcode einlösen?",
            },
            {
              answer:
                "Aktionscodes gelten normalerweise einmal pro Person und Bestellung. Die genauen Bedingungen stehen bei der jeweiligen Aktion.",
              id: "reuse-code",
              position: 1,
              question: "Kann ich einen Rabattcode mehrmals verwenden?",
            },
            {
              answer:
                "Einige Aktionen haben einen Mindestbestellwert. Ob und in welcher Höhe er gilt, steht in den Aktionsbedingungen.",
              id: "minimum-order",
              position: 2,
              question: "Gibt es einen Mindestbestellwert?",
            },
            {
              answer:
                "Die Gültigkeit steht beim jeweiligen Code oder Angebot. Nach Ablauf wird die Aktion nicht mehr berücksichtigt.",
              id: "validity",
              position: 3,
              question: "Wie lange ist ein Rabattcode gültig?",
            },
            {
              answer:
                "Das hängt von der Aktion ab. Die Bedingungen nennen ausdrücklich, ob der Code für bereits reduzierte Produkte gilt.",
              id: "reduced-products",
              position: 4,
              question: "Kann ich Rabattcodes für reduzierte Artikel nutzen?",
            },
            {
              answer:
                "Prüfe Schreibweise, Gültigkeitszeitraum, Mindestbestellwert und teilnehmende Produkte. Wenn der Code weiterhin abgelehnt wird, hilft der Kundenservice weiter.",
              id: "invalid-code",
              position: 5,
              question:
                "Was kann ich tun, wenn mein Rabattcode nicht funktioniert?",
            },
            {
              answer:
                "Ja. Auf dieser Seite bündeln wir dauerhaft reduzierte Möbel und wechselnde Aktionen. Das Sortiment kann sich ändern, sobald Artikel ausverkauft sind.",
              id: "permanent-sale",
              position: 6,
              question: "Gibt es bei JVMöbel einen dauerhaften Sale?",
            },
          ],
          title: "Häufige Fragen zu Rabattcodes",
        }),
        createCmsBlock("jv-home-editorial", 7, {
          appearance: "plain",
          introduction: [
            "Bei JVMöbel findest du das ganze Jahr über ausgewählte Möbel und Wohnaccessoires zu reduzierten Preisen. Aktueller Preis und vorheriger Vergleichspreis zeigen den Vorteil direkt am Produkt.",
          ],
          sections: [
            {
              id: "saving-options",
              paragraphs: [
                "<strong>Newsletter:</strong> Erfahre frühzeitig von neuen Aktionen, Sortimentsergänzungen und zeitlich begrenzten Preisvorteilen.",
                "<strong>Sale und Rabattaktionen:</strong> Reduzierte Produkte sind mit dem gültigen Vorteilspreis ausgezeichnet. Aktionscodes können für ausgewählte Produkte, Kategorien oder ab einem bestimmten Bestellwert gelten.",
              ],
              position: 0,
              title: "So kannst du bei JVMöbel sparen",
            },
            {
              id: "rooms",
              paragraphs: [
                "Im Sale findest du Sofas, Sessel, Tische, Betten, Schränke, Regale, Leuchten, Teppiche und Wohnaccessoires für unterschiedliche Räume und Einrichtungsstile.",
              ],
              position: 1,
              title: "Reduzierte Möbel für jeden Raum",
            },
            {
              id: "filters",
              paragraphs: [
                "Nutze im Shop die Filter für Kategorie, Eigenschaften, Marke und Preis, um passende Möbel miteinander zu vergleichen.",
              ],
              position: 2,
              title: "Schneller das passende Angebot finden",
            },
            {
              id: "design",
              paragraphs: [
                "Ein reduzierter Preis schränkt die Auswahl nicht auf einen Stil ein. Vergleiche klare moderne Formen, warme Naturmaterialien und markante Polstermöbel direkt miteinander.",
              ],
              position: 3,
              title: "Preisvorteil ohne Kompromisse beim Design",
            },
            {
              id: "delivery",
              paragraphs: [
                "Auf der Produktseite findest du Maße, Materialien, Varianten und Lieferinformationen. Bei teilnehmenden Produkten kannst du zusätzliche Services auswählen.",
              ],
              position: 4,
              title: "Günstig bestellen und komfortabel liefern lassen",
            },
          ],
          showLessLabel: "Weniger anzeigen",
          showMoreLabel: "Mehr über Sale, Auswahl und Lieferung",
          statement: "Ratgeber & Service",
          title: "Möbel im Sale bequem online bestellen",
        }),
      ],
      id: "mock-discount-offers-section",
      position: 0,
      sizingMode: "full_width",
      type: "default",
    },
  ],
  type: "landingpage",
};
