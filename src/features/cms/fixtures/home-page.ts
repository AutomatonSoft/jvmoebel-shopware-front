import type { CmsPage } from "@/features/cms/model/page";

const pageId = "mock-home-page";
const sectionId = "mock-home-section";
const heroBlockId = "mock-home-hero-block";
const roomGridBlockId = "mock-home-room-grid-block";
const productGridBlockId = "mock-home-product-grid-block";
const homeEditorialBlockId = "mock-home-editorial-block";
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
                eyebrow: "The new living collection",
                title: "A home that feels like you.",
                description:
                  "Thoughtful furniture, rich textures and lasting comfort — curated for everyday living.",
                image: {
                  alt: "Warm contemporary living room with an ivory sofa",
                  url: "/images/hero-editorial.webp",
                },
                primaryLink: {
                  label: "Shop new arrivals",
                  size: "large",
                  url: "/new-in",
                },
                secondaryLink: {
                  label: "Explore the collection",
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
          id: homeEditorialBlockId,
          position: 3,
          type: "jv-home-editorial",
          slots: [
            {
              id: "mock-home-editorial-slot",
              slot: "content",
              type: "jv-home-editorial",
              data: {
                introduction: [
                  "In unserem umfassenden Sortiment mit über 60.000 Artikeln finden Sie mühelos trendige und preiswerte Möbel, bezaubernde Lieblingsstücke und Inspirationen für die Gestaltung Ihres Zuhauses. Neben modernen und weichen Eckcouchen bieten wir diese auch in verschiedenen Größen an. Ob Kinderzimmer Möbel, Esszimmer Möbel, Wohnzimmer Möbel, Schlafzimmer Möbel oder Büro Möbel – unsere Möbel bieten wir online nun seit gut 20 Jahren an.",
                  "Verleihen Sie Ihrem Zuhause mit hochwertigen Möbeln, Lampen und Wohnaccessoires den gewünschten Stil. Unser Angebot umfasst moderne Möbel zu unschlagbaren Preisen, namhafte Marken, erstklassige Materialien und exklusive Markenneuheiten. Dies und vieles mehr erwartet Sie in unserem Online-Möbelhaus.",
                ],
                sections: {
                  assortment: {
                    id: "editorial-assortment",
                    paragraphs: [
                      "Möbel günstig kaufen, da sind Sie genau richtig bei uns. Moderne Wohnzimmer Einrichtung oder ausgefallene Big Sofa machen Ihren Traum vom schönen Wohnen wahr. In unserer traumhaften Polsterwelt finden Sie zahlreiche Möbelstücke wie Wohnwand, Wohnlandschaft U Form und günstige Sideboards. Oft sind die Wohnlandschaften beleuchtet und sehr ausgefallen. Auch für den Essbereich finden Sie alles, was Ihr Herz begehrt. Von Esszimmerstühlen bis zu kompletten Essgarnituren ist für jeden etwas dabei. Ein besonderes Merkmal in unserem Sortiment sind die Wohnzimmermöbel aus Italien.",
                      "Auch für die kleinen Seelen unter uns haben wir besondere Einrichtungen für das Kinderzimmer. Moderne oder klassische Möbel fürs Kinderzimmer sind ein Traum. Außer günstigen Kinderzimmermöbel bieten wir auch Einzelstücke wie Kinder Kleiderschrank und Kinderzimmer Regale. Ob ein Kleiderschrank Kinderzimmer für Mädchen oder kinderschränke Kinderzimmer für Jungs – Sie finden bei uns eine große Auswahl an günstigen Kinderzimmermöbeln. Außerdem bieten wir auch Doppelstockbetten oder Etagenbetten mit Regalen und Schränken an.",
                    ],
                    position: 0,
                  },
                  bedroom: {
                    id: "editorial-bedroom",
                    paragraphs: [
                      "Wussten Sie, dass Sie 25 bis 31 Jahre Ihres Lebens mit Schlafen verbringen? Lassen Sie sich von unseren Ideen für das Schlafzimmer verzaubern und holen Sie sich diese direkt nach Hause. Neben den Schlafzimmermöbeln fürs Kind haben wir auch die Einrichtung für das Elternschlafzimmer. Neben ganzen Set-Schlafzimmer bieten wir auch runde Betten oder Chesterfield Betten an. Neben klassischen Betten sind auch moderne Betten bei uns ein Bestseller. Ein besonderes Merkmal fällt hier auf die typischen Boxspringbetten. Diese gibt es als klassische Betten mit Beleuchtung oder mit Metallverzierungen. Das Set-Schlafzimmer kann bereits zu günstigen Preisen erworben werden. Natürlich bieten wir auch den Schlafzimmerschrank, die Kommode oder das Sideboard einzeln an. Diese können nicht nur im modernen Schlafzimmer, sondern auch als Möbelstück im modernen oder klassischen Wohnzimmer verwendet werden. Der Schlafzimmerschrank ist übrigens in verschiedenen Ausführungen erhältlich, z.B. sechstürige oder viertürige Schränke. Lassen Sie sich von uns beraten und richten Sie Ihr Schlafzimmer modern oder klassisch ein.",
                    ],
                    position: 1,
                    title: "Gesund und schön schlafen! Schönes Schlafzimmer",
                  },
                  diningRoom: {
                    id: "editorial-dining-room",
                    paragraphs: [
                      "Wussten Sie, dass Sie 2,50 bis 5,00 Jahre Ihres Lebens mit Essen verbringen? Ein großer Blickfang sind auch unsere Möbel im Essbereich. Klassische Chesterfield Esszimmer Garnituren oder moderne Essgruppen werden auch als Esstisch Stühle Set angeboten. Neben ganzen Wohnideen für das Esszimmer bieten wir direkte Inspiration, passende Stühle, Hocker, Sessel, Bänke oder Esstische zu finden. Wir empfehlen die Epoxidharz-Tische. Diese sind blau gehalten und ein echter Blickfang für Ihre Nachbarn.",
                    ],
                    position: 2,
                    title: "Eine schöne Wohnzimmergarnitur für Sie",
                  },
                  additionalRanges: {
                    id: "editorial-additional-ranges",
                    paragraphs: [
                      "Wussten Sie, dass ein Mensch bis zu 2,50 Jahre seines Lebens im Badezimmer verbringt? Ein schönes Badezimmer sollte zu Ihrer Mindestausstattung gehören. Unser Angebot an Waschtischen, Badezimmermöbeln und Badmöbeln wird Sie begeistern.",
                      "Wussten Sie, dass der Mensch im Jahr über 45 Jahre im Büro verbringen kann? Diese Tatsache sollte einem zu denken geben, ob man nicht sein Leben mit einer schönen Büroeinrichtung genießt. JVmoebel bietet eine große Auswahl an Büro Schreibtischen. Dazu finden Sie auch den passenden Aktenschrank. Die breite Auswahl an Büroausstattung finden Sie als modernes Büro oder als klassisches Büro. Das Ganze gibt es auch als Büro Möbel Set zur Auswahl. Für unsere gewerblichen Kunden bieten wir spezielle Angebote an. Lassen Sie sich hier zu unserer Hotel Einrichtung durch unseren Hotelzimmer Einrichter beraten. Unser Angebot mit Lounge, Club oder Zimmer Möbel wird Ihrem Hotel einen neuen Touch verleihen.",
                    ],
                    position: 3,
                  },
                },
                showLessLabel: "Weniger anzeigen",
                showMoreLabel: "Alles anzeigen",
                statement:
                  "Der von uns angebotene Service für unsere geschätzten Kunden zeichnet sich durch höchste Qualität und herausragende Merkmale aus.",
                title:
                  "Willkommen bei JV Möbel – Ihrem Online-Möbelhaus für Design & Qualität",
              },
            },
          ],
        },
        {
          id: newsletterBlockId,
          position: 4,
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
