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
                  "In unserem umfassenden Sortiment mit über 60.000 Artikeln finden Sie mühelos <a href='/shop'>trendige und preiswerte Möbel</a>, bezaubernde Lieblingsstücke und Inspirationen für die Gestaltung Ihres Zuhauses. Neben modernen und weichen <a href='/living/sofas'>Eckcouchen</a> bieten wir diese auch in verschiedenen Größen an. Ob <a href='/children'>Kinderzimmer Möbel</a>, <a href='/dining'>Esszimmer Möbel</a>, <a href='/living'>Wohnzimmer Möbel</a>, <a href='/bedroom'>Schlafzimmer Möbel</a> oder <a href='/office'>Büro Möbel</a> – unsere Möbel bieten wir online nun seit gut 20 Jahren an.",
                  "Verleihen Sie Ihrem Zuhause mit hochwertigen <a href='/shop'>Möbeln</a>, <a href='/lighting'>Lampen</a> und <a href='/decor'>Wohnaccessoires</a> den gewünschten Stil. Unser Angebot umfasst moderne Möbel zu unschlagbaren Preisen, namhafte Marken, erstklassige Materialien und exklusive Markenneuheiten. Dies und vieles mehr erwartet Sie in unserem <a href='/shop'>Online-Möbelhaus</a>.",
                ],
                sections: {
                  assortment: {
                    id: "editorial-assortment",
                    paragraphs: [
                      "Möbel günstig kaufen, da sind Sie genau richtig bei uns. Moderne <a href='/living'>Wohnzimmer Einrichtung</a> oder ausgefallene <a href='/living/sofas'>Big Sofa</a> machen Ihren Traum vom schönen Wohnen wahr. In unserer traumhaften <a href='/living/sofas'>Polsterwelt</a> finden Sie zahlreiche Möbelstücke wie <a href='/storage'>Wohnwand</a>, <a href='/living/sofas'>Wohnlandschaft U Form</a> und <a href='/storage'>günstige Sideboards</a>. Oft sind die Wohnlandschaften beleuchtet und sehr ausgefallen. Auch für den Essbereich finden Sie alles, was Ihr Herz begehrt. Von <a href='/dining'>Esszimmerstühlen</a> bis zu kompletten <a href='/dining'>Essgarnituren</a> ist für jeden etwas dabei. Ein besonderes Merkmal in unserem Sortiment sind die <a href='/living'>Wohnzimmermöbel aus Italien</a>.",
                      "Auch für die kleinen Seelen unter uns haben wir besondere Einrichtungen für das <a href='/children'>Kinderzimmer</a>. Moderne oder klassische Möbel fürs Kinderzimmer sind ein Traum. Außer günstigen <a href='/children'>Kinderzimmermöbel</a> bieten wir auch Einzelstücke wie <a href='/children'>Kinder Kleiderschrank</a> und <a href='/children'>Kinderzimmer Regale</a>. Ob ein <a href='/children'>Kleiderschrank Kinderzimmer</a> für Mädchen oder kinderschränke Kinderzimmer für Jungs – Sie finden bei uns eine große Auswahl an günstigen Kinderzimmermöbeln. Außerdem bieten wir auch <a href='/children'>Doppelstockbetten</a> oder <a href='/children'>Etagenbetten</a> mit Regalen und Schränken an.",
                    ],
                    position: 0,
                  },
                  bedroom: {
                    id: "editorial-bedroom",
                    paragraphs: [
                      "Wussten Sie, dass Sie 25 bis 31 Jahre Ihres Lebens mit Schlafen verbringen? Lassen Sie sich von unseren <a href='/bedroom'>Ideen für das Schlafzimmer</a> verzaubern und holen Sie sich diese direkt nach Hause. Neben den Schlafzimmermöbeln fürs Kind haben wir auch die Einrichtung für das Elternschlafzimmer. Neben ganzen <a href='/bedroom'>Set-Schlafzimmer</a> bieten wir auch <a href='/bedroom'>runde Betten</a> oder <a href='/bedroom'>Chesterfield Betten</a> an. Neben klassischen Betten sind auch moderne Betten bei uns ein Bestseller. Ein besonderes Merkmal fällt hier auf die typischen <a href='/bedroom'>Boxspringbetten</a>. Diese gibt es als klassische Betten mit Beleuchtung oder mit Metallverzierungen. Das <a href='/bedroom'>Set-Schlafzimmer</a> kann bereits zu günstigen Preisen erworben werden. Natürlich bieten wir auch den <a href='/bedroom'>Schlafzimmerschrank</a>, die <a href='/storage'>Kommode</a> oder das <a href='/storage'>Sideboard</a> einzeln an. Diese können nicht nur im modernen Schlafzimmer, sondern auch als Möbelstück im modernen oder klassischen Wohnzimmer verwendet werden. Der <a href='/bedroom'>Schlafzimmerschrank</a> ist übrigens in verschiedenen Ausführungen erhältlich, z.B. sechstürige oder viertürige Schränke. Lassen Sie sich von uns beraten und richten Sie Ihr Schlafzimmer modern oder klassisch ein.",
                    ],
                    position: 1,
                    title: "Gesund und schön schlafen! Schönes Schlafzimmer",
                  },
                  diningRoom: {
                    id: "editorial-dining-room",
                    paragraphs: [
                      "Wussten Sie, dass Sie 2,50 bis 5,00 Jahre Ihres Lebens mit Essen verbringen? Ein großer Blickfang sind auch unsere Möbel im <a href='/dining'>Essbereich</a>. Klassische <a href='/dining'>Chesterfield Esszimmer Garnituren</a> oder moderne <a href='/dining'>Essgruppen</a> werden auch als <a href='/dining'>Esstisch Stühle Set</a> angeboten. Neben ganzen Wohnideen für das Esszimmer bieten wir direkte Inspiration, passende Stühle, Hocker, Sessel, Bänke oder Esstische zu finden. Wir empfehlen die <a href='/dining'>Epoxidharz-Tische</a>. Diese sind blau gehalten und ein echter Blickfang für Ihre Nachbarn.",
                    ],
                    position: 2,
                    title: "Eine schöne Wohnzimmergarnitur für Sie",
                  },
                  additionalRanges: {
                    id: "editorial-additional-ranges",
                    paragraphs: [
                      "Wussten Sie, dass ein Mensch bis zu 2,50 Jahre seines Lebens im <a href='/bathroom'>Badezimmer</a> verbringt? Ein schönes Badezimmer sollte zu Ihrer Mindestausstattung gehören. Unser Angebot an <a href='/bathroom'>Waschtischen</a>, <a href='/bathroom'>Badezimmermöbeln und Badmöbeln</a> wird Sie begeistern.",
                      "Wussten Sie, dass der Mensch im Jahr über 45 Jahre im <a href='/office'>Büro</a> verbringen kann? Diese Tatsache sollte einem zu denken geben, ob man nicht sein Leben mit einer schönen <a href='/office'>Büroeinrichtung</a> genießt. JVmoebel bietet eine große Auswahl an <a href='/office'>Büro Schreibtischen</a>. Dazu finden Sie auch den passenden <a href='/office'>Aktenschrank</a>. Die breite Auswahl an Büroausstattung finden Sie als <a href='/office'>modernes Büro</a> oder als <a href='/office'>klassisches Büro</a>. Das Ganze gibt es auch als <a href='/office'>Büro Möbel Set</a> zur Auswahl. Für unsere gewerblichen Kunden bieten wir spezielle Angebote an. Lassen Sie sich hier zu unserer <a href='/business'>Hotel Einrichtung</a> durch unseren <a href='/business'>Hotelzimmer Einrichter</a> beraten. Unser Angebot mit <a href='/business'>Lounge, Club oder Zimmer Möbel</a> wird Ihrem Hotel einen neuen Touch verleihen.",
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
