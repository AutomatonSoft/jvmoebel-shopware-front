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
                ariaLabel: "Aktuelle Angebote und Wohnideen",
                autoplay: true,
                autoplayIntervalMs: 6500,
                slides: {
                  livingRoom: {
                    description:
                      "Entdecken Sie ausgewählte Sofas, Tische und Wohnideen für ein Zuhause mit Persönlichkeit.",
                    eyebrow: "Neue Wohnideen",
                    id: "hero-living-room",
                    image: {
                      alt: "Helles Wohnzimmer mit einem großzügigen Sofa",
                      url: "/images/hero-editorial.webp",
                    },
                    layout: "featured",
                    position: 0,
                    primaryLink: {
                      label: "Wohnzimmer entdecken",
                      size: "large",
                      url: "/living",
                    },
                    promotion: {
                      label: "Ausgewählte Kollektionen",
                      value: "Bis zu 20 %",
                    },
                    secondaryLink: {
                      label: "Alle Möbel ansehen",
                      size: "medium",
                      url: "/shop",
                    },
                    title: "Wohnzimmer, die sich nach Ihnen anfühlen.",
                  },
                  nomaChair: {
                    eyebrow: "Neu eingetroffen",
                    id: "hero-noma-chair",
                    image: {
                      alt: "Noma Loungesessel aus rostfarbenem Bouclé",
                      url: "/images/lounge-chair.webp",
                    },
                    layout: "caption",
                    position: 1,
                    promotion: {
                      value: "895 €",
                    },
                    title: "Noma Loungesessel zum Einführungspreis",
                  },
                  diningRoom: {
                    eyebrow: "Nur für kurze Zeit",
                    id: "hero-dining-room",
                    image: {
                      alt: "Esszimmer mit rundem Holztisch und gepolsterten Stühlen",
                      url: "/images/dining-room.webp",
                    },
                    layout: "caption",
                    position: 2,
                    primaryLink: {
                      label: "Esszimmer entdecken",
                      size: "large",
                      url: "/dining",
                    },
                    promotion: {
                      value: "-15 %",
                    },
                    title: "Sale-Specials fürs Esszimmer mit bis zu",
                  },
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
                eyebrow: "Shop by room",
                title: "Furniture for every room.",
                description:
                  "Start with the space you are furnishing, then discover pieces selected to work naturally together.",
                rooms: {
                  livingRoom: {
                    featured: 1,
                    id: "living-room",
                    image: {
                      alt: "Contemporary living room",
                      url: "/images/hero-living.webp",
                    },
                    label: "Living room",
                    position: 0,
                    title: "Sofas, armchairs & tables",
                    url: "/living",
                  },
                  diningRoom: {
                    featured: 0,
                    id: "dining-room",
                    image: {
                      alt: "Warm walnut dining room",
                      url: "/images/dining-room.webp",
                    },
                    label: "Dining",
                    position: 1,
                    title: "Tables, chairs & storage",
                    url: "/dining",
                  },
                  bedroom: {
                    featured: 0,
                    id: "bedroom",
                    image: {
                      alt: "Quiet neutral bedroom",
                      url: "/images/bedroom.webp",
                    },
                    label: "Bedroom",
                    position: 2,
                    title: "Beds, bedside & wardrobes",
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
                eyebrow: "Selected for you",
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
                        alt: "Alba modular sofa in a warm living room",
                        url: "/images/hero-living.webp",
                      },
                    },
                    id: "alba",
                    position: 0,
                    ratingAverage: 4.9,
                    reviewCount: 128,
                    translated: {
                      description: "Natural bouclé · 4 seats",
                      name: "Alba Modular Sofa",
                    },
                    url: "/product/alba",
                  },
                  noma: {
                    badge: "New",
                    calculatedPrice: {
                      unitPrice: 895,
                    },
                    cover: {
                      media: {
                        alt: "Noma rust lounge chair",
                        url: "/images/lounge-chair.webp",
                      },
                    },
                    id: "noma",
                    position: 1,
                    ratingAverage: 4.8,
                    reviewCount: 64,
                    translated: {
                      description: "Rust bouclé · Walnut",
                      name: "Noma Lounge Chair",
                    },
                    url: "/product/noma",
                  },
                  forma: {
                    badge: "Low stock",
                    calculatedPrice: {
                      unitPrice: 1290,
                    },
                    cover: {
                      media: {
                        alt: "Forma solid walnut media console",
                        url: "/images/media-console.webp",
                      },
                    },
                    id: "forma",
                    position: 2,
                    ratingAverage: 4.7,
                    reviewCount: 39,
                    translated: {
                      description: "Solid walnut · 180 cm",
                      name: "Forma Media Console",
                    },
                    url: "/product/forma",
                  },
                  mira: {
                    badge: "Sale",
                    calculatedPrice: {
                      listPrice: {
                        price: 1950,
                      },
                      unitPrice: 1650,
                    },
                    cover: {
                      media: {
                        alt: "Mira table in a warm walnut dining room",
                        url: "/images/dining-room.webp",
                      },
                    },
                    id: "mira",
                    position: 3,
                    ratingAverage: 4.9,
                    reviewCount: 81,
                    translated: {
                      description: "Smoked oak · Ø 140 cm",
                      name: "Mira Dining Table",
                    },
                    url: "/product/mira",
                  },
                },
                title: "Featured pieces",
                viewAll: {
                  label: "View all products",
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
                buttonLabel: "Join us",
                buttonSize: "large",
                description:
                  "Room guides, material care and first access to new pieces. No daily emails.",
                errorMessage: "Subscription failed. Please try again.",
                eyebrow: "The good-room letter",
                invalidEmailMessage: "Enter a valid email address.",
                placeholder: "Your email address",
                storefrontUrl: "http://localhost:3000",
                successMessage: "You're on the list. Welcome home.",
                title: "Useful ideas, occasionally.",
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies CmsPage;
