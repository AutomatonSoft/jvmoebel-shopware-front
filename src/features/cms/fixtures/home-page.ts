import type { CmsPage } from "@/features/cms/model/page";

const pageId = "mock-home-page";
const sectionId = "mock-home-section";
const heroBlockId = "mock-home-hero-block";
const categoryRailBlockId = "mock-home-category-rail-block";
const shopTheLookBlockId = "mock-home-shop-the-look-block";
const roomGridBlockId = "mock-home-room-grid-block";
const productGridBlockId = "mock-home-product-grid-block";
const whyJvmoebelBlockId = "mock-home-why-jvmoebel-block";
const newsletterBlockId = "mock-home-newsletter-block";

export const homeCmsPageMock = {
  id: pageId,
  type: "page",
  sections: [
    {
      id: sectionId,
      position: 0,
      sizingMode: "full_width",
      type: "default",
      blocks: [
        {
          id: heroBlockId,
          position: 0,
          type: "jv-hero",
          slots: [
            {
              id: "mock-home-hero-slot",
              slot: "content",
              type: "jv-hero",
              data: {
                eyebrow: "Die neue Wohnkollektion",
                title: "Ein Zuhause, das zu Ihnen passt.",
                description:
                  "Durchdachte Möbel, edle Texturen und dauerhafter Komfort — ausgewählt für das tägliche Leben.",
                image: {
                  alt: "Modernes, warm eingerichtetes Wohnzimmer mit elfenbeinfarbenem Sofa",
                  url: "/images/main/hero-editorial.webp",
                },
                primaryLink: {
                  label: "Neuheiten entdecken",
                  size: "large",
                  url: "/new-in",
                },
                secondaryLink: {
                  label: "Kollektion entdecken",
                  size: "medium",
                  url: "/living",
                },
              },
            },
          ],
        },
        {
          id: categoryRailBlockId,
          position: 1,
          type: "jv-category-rail",
          slots: [
            {
              id: "mock-home-category-rail-slot",
              slot: "content",
              type: "jv-category-rail",
              data: {
                categories: {
                  sofas: {
                    id: "popular-sofas",
                    image: {
                      alt: "Helles Sofa in einem warmen Wohnzimmer",
                      url: "/images/main/hero-living.webp",
                    },
                    label: "Sofas & Couches",
                    position: 0,
                    url: "/living/sofas",
                  },
                  armchairs: {
                    id: "popular-armchairs",
                    image: {
                      alt: "Rostroter Loungesessel",
                      url: "/images/main/lounge-chair.webp",
                    },
                    label: "Sessel",
                    position: 1,
                    url: "/living/armchairs",
                  },
                  diningTables: {
                    id: "popular-dining-tables",
                    image: {
                      alt: "Esstisch aus dunklem Holz",
                      url: "/images/main/dining-room.webp",
                    },
                    label: "Esstische",
                    position: 2,
                    url: "/dining/tables",
                  },
                  beds: {
                    id: "popular-beds",
                    image: {
                      alt: "Ruhiges Schlafzimmer in hellen Naturtönen",
                      url: "/images/main/bedroom.webp",
                    },
                    label: "Betten",
                    position: 3,
                    url: "/bedroom/beds",
                  },
                  tvFurniture: {
                    id: "popular-tv-furniture",
                    image: {
                      alt: "TV-Lowboard aus Walnussholz",
                      url: "/images/main/media-console.webp",
                    },
                    label: "TV-Möbel",
                    position: 4,
                    url: "/living/tv-furniture",
                  },
                  newArrivals: {
                    id: "popular-new-arrivals",
                    image: {
                      alt: "Neue Möbelkollektion in einem hellen Interieur",
                      url: "/images/main/hero-editorial.webp",
                    },
                    label: "Neuheiten",
                    position: 5,
                    url: "/new-in",
                  },
                },
                description:
                  "Direkt zu den Möbeln, die Ihr Zuhause besonders machen.",
                eyebrow: "Schnell entdecken",
                title: "Beliebte Kategorien",
                viewAll: {
                  label: "Alle Kategorien",
                  url: "/shop",
                },
              },
            },
          ],
        },
        {
          id: shopTheLookBlockId,
          position: 2,
          type: "jv-shop-the-look",
          slots: [
            {
              id: "mock-home-shop-the-look-slot",
              slot: "content",
              type: "jv-shop-the-look",
              data: {
                description:
                  "Entdecken Sie die Möbel dieses Wohnzimmers und stellen Sie den Look passend zu Ihrem Zuhause zusammen.",
                eyebrow: "Ein Raum, ein Look",
                image: {
                  alt: "Helles Wohnzimmer mit Sofa, Loungesessel und TV-Lowboard",
                  url: "/images/main/hero-living.webp",
                },
                items: {
                  sofa: {
                    description: "Naturfarbenes Bouclé · modular kombinierbar",
                    hotspot: { x: 69, y: 66 },
                    id: "look-alba-sofa",
                    name: "Alba Modulsofa",
                    position: 0,
                    url: "/product/alba",
                  },
                  armchair: {
                    description: "Rostrotes Bouclé · weiche Rundungen",
                    hotspot: { x: 85, y: 79 },
                    id: "look-noma-armchair",
                    name: "Noma Loungesessel",
                    position: 1,
                    url: "/product/noma",
                  },
                  lowboard: {
                    description: "Dunkles Holz · klare Linien",
                    hotspot: { x: 63, y: 55 },
                    id: "look-forma-lowboard",
                    name: "Forma TV-Lowboard",
                    position: 2,
                    url: "/product/forma",
                  },
                },
                title: "Diesen Look nach Hause holen.",
                viewAll: {
                  label: "Wohnzimmer entdecken",
                  url: "/living",
                },
              },
            },
          ],
        },
        {
          id: roomGridBlockId,
          position: 3,
          type: "jv-room-grid",
          slots: [
            {
              id: "mock-home-room-grid-slot",
              slot: "content",
              type: "jv-room-grid",
              data: {
                eyebrow: "Nach Räumen entdecken",
                title: "Möbel für jeden Raum.",
                description:
                  "Beginnen Sie mit dem Raum, den Sie einrichten möchten, und entdecken Sie Möbel, die harmonisch zusammenspielen.",
                rooms: {
                  livingRoom: {
                    featured: 1,
                    id: "living-room",
                    image: {
                      alt: "Modern eingerichtetes Wohnzimmer",
                      url: "/images/main/hero-living.webp",
                    },
                    label: "Wohnzimmer",
                    position: 0,
                    title: "Sofas, Sessel & Tische",
                    url: "/living",
                  },
                  diningRoom: {
                    featured: 0,
                    id: "dining-room",
                    image: {
                      alt: "Warm eingerichtetes Esszimmer mit Walnussholz",
                      url: "/images/main/dining-room.webp",
                    },
                    label: "Esszimmer",
                    position: 1,
                    title: "Tische, Stühle & Stauraum",
                    url: "/dining",
                  },
                  bedroom: {
                    featured: 0,
                    id: "bedroom",
                    image: {
                      alt: "Ruhiges Schlafzimmer in neutralen Farben",
                      url: "/images/main/bedroom.webp",
                    },
                    label: "Schlafzimmer",
                    position: 2,
                    title: "Betten, Nachttische & Kleiderschränke",
                    url: "/bedroom",
                  },
                },
              },
            },
          ],
        },
        {
          id: productGridBlockId,
          position: 4,
          type: "jv-product-grid",
          slots: [
            {
              id: "mock-home-product-grid-slot",
              slot: "content",
              type: "jv-product-grid",
              data: {
                currency: "EUR",
                eyebrow: "Für Sie ausgewählt",
                locale: "de-DE",
                products: {
                  alba: {
                    badge: "Bestseller",
                    calculatedPrice: {
                      listPrice: {
                        price: 2890,
                      },
                      unitPrice: 2490,
                    },
                    cover: {
                      media: {
                        alt: "Alba Modulsofa in einem warm eingerichteten Wohnzimmer",
                        url: "/images/main/hero-living.webp",
                      },
                    },
                    id: "alba",
                    position: 0,
                    ratingAverage: 4.9,
                    reviewCount: 128,
                    translated: {
                      description: "Naturfarbenes Bouclé · 4-Sitzer",
                      name: "Alba Modulsofa",
                    },
                    url: "/product/alba",
                  },
                  noma: {
                    badge: "Neu",
                    calculatedPrice: {
                      unitPrice: 895,
                    },
                    cover: {
                      media: {
                        alt: "Noma Loungesessel in Rostrot",
                        url: "/images/main/lounge-chair.webp",
                      },
                    },
                    id: "noma",
                    position: 1,
                    ratingAverage: 4.8,
                    reviewCount: 64,
                    translated: {
                      description: "Rostrotes Bouclé · Walnussholz",
                      name: "Noma Loungesessel",
                    },
                    url: "/product/noma",
                  },
                  forma: {
                    badge: "Nur noch wenige verfügbar",
                    calculatedPrice: {
                      unitPrice: 1290,
                    },
                    cover: {
                      media: {
                        alt: "Forma TV-Lowboard aus massivem Walnussholz",
                        url: "/images/main/media-console.webp",
                      },
                    },
                    id: "forma",
                    position: 2,
                    ratingAverage: 4.7,
                    reviewCount: 39,
                    translated: {
                      description: "Massives Walnussholz · 180 cm",
                      name: "Forma TV-Lowboard",
                    },
                    url: "/product/forma",
                  },
                  mira: {
                    badge: "Angebot",
                    calculatedPrice: {
                      listPrice: {
                        price: 1950,
                      },
                      unitPrice: 1650,
                    },
                    cover: {
                      media: {
                        alt: "Mira Tisch in einem warm eingerichteten Esszimmer",
                        url: "/images/main/dining-room.webp",
                      },
                    },
                    id: "mira",
                    position: 3,
                    ratingAverage: 4.9,
                    reviewCount: 81,
                    translated: {
                      description: "Geräucherte Eiche · Ø 140 cm",
                      name: "Mira Esstisch",
                    },
                    url: "/product/mira",
                  },
                },
                title: "Ausgewählte Möbelstücke",
                viewAll: {
                  label: "Alle Produkte ansehen",
                  url: "/shop",
                },
              },
            },
          ],
        },
        {
          id: whyJvmoebelBlockId,
          position: 5,
          type: "jv-why-jvmoebel",
          slots: [
            {
              id: "mock-home-why-jvmoebel-slot",
              slot: "content",
              type: "jv-why-jvmoebel",
              data: {
                benefits: {
                  design: {
                    description:
                      "Ausdrucksstarke Formen und angenehme Materialien für ein Zuhause mit Charakter.",
                    icon: "design",
                    id: "why-jvmoebel-design",
                    position: 0,
                    title: "Ausgewählte Designs",
                    url: "/shop",
                  },
                  advice: {
                    description:
                      "Persönliche Hilfe bei Auswahl, Kombination und Bestellung.",
                    icon: "advice",
                    id: "why-jvmoebel-advice",
                    position: 1,
                    title: "Persönliche Beratung",
                    url: "/kontakt",
                  },
                  payment: {
                    description:
                      "Vertraute Zahlungsarten und ein transparenter Bestellprozess.",
                    icon: "payment",
                    id: "why-jvmoebel-payment",
                    position: 2,
                    title: "Sicher bezahlen",
                    url: "/zahlungsarten",
                  },
                },
                description:
                  "Wir verbinden charakterstarkes Design mit persönlichem Service und einem Einkauf, der sich einfach und verlässlich anfühlt.",
                eyebrow: "Mehr als nur Möbel",
                mark: "JVM",
                tagline: "Für Räume mit Persönlichkeit",
                title: "Warum JVMöbel?",
                viewAll: {
                  label: "Mehr über JVMöbel",
                  url: "/ueber-uns",
                },
              },
            },
          ],
        },
        {
          id: newsletterBlockId,
          position: 6,
          type: "jv-newsletter",
          slots: [
            {
              id: "mock-home-newsletter-slot",
              slot: "content",
              type: "jv-newsletter",
              data: {
                buttonLabel: "Anmelden",
                buttonSize: "large",
                description:
                  "Einrichtungstipps, Materialpflege und früher Zugang zu neuen Möbelstücken. Keine täglichen E-Mails.",
                errorMessage:
                  "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
                eyebrow: "Der Newsletter für schönes Wohnen",
                invalidEmailMessage:
                  "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
                placeholder: "Ihre E-Mail-Adresse",
                storefrontUrl: "http://localhost:3000",
                successMessage: "Sie sind dabei. Willkommen zu Hause.",
                title: "Gute Ideen, gelegentlich.",
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies CmsPage;
