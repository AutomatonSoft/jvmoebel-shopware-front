import type { CmsPage } from "@/features/cms/model/page";

const pageId = "mock-home-page";
const sectionId = "mock-home-section";
const heroBlockId = "mock-home-hero-block";
const roomGridBlockId = "mock-home-room-grid-block";
const productGridBlockId = "mock-home-product-grid-block";
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
                  url: "/images/hero-editorial.webp",
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
          id: roomGridBlockId,
          position: 1,
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
                      url: "/images/hero-living.webp",
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
                      url: "/images/dining-room.webp",
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
                      url: "/images/bedroom.webp",
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
          position: 2,
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
                        url: "/images/hero-living.webp",
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
                        url: "/images/lounge-chair.webp",
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
                        url: "/images/media-console.webp",
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
                        url: "/images/dining-room.webp",
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
          id: newsletterBlockId,
          position: 3,
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
